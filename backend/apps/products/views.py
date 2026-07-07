import os
from django.conf import settings
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductSerializer, ProductImageSerializer
from .permissions import IsAdminOrReadOnly


# ─── Categories ───────────────────────────────────────────────────────────────
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveDestroyAPIView):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# ─── Products ─────────────────────────────────────────────────────────────────
class ProductListCreateView(generics.ListCreateAPIView):
    queryset           = Product.objects.all().prefetch_related("images").select_related("category")
    serializer_class   = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["category__slug", "is_featured", "is_best_seller"]
    search_fields      = ["name", "description"]
    ordering_fields    = ["price", "rating", "created_at"]
    ordering           = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        max_price = self.request.query_params.get("max_price")
        if max_price:
            qs = qs.filter(price__lte=max_price)
        return qs


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Product.objects.all().prefetch_related("images").select_related("category")
    serializer_class   = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_destroy(self, instance):
        # Delete image files from disk before deleting the product
        for img in instance.images.all():
            if img.image:
                file_path = os.path.join(settings.MEDIA_ROOT, str(img.image))
                if os.path.exists(file_path):
                    os.remove(file_path)
        instance.delete()


# ─── Product Image Upload ──────────────────────────────────────────────────────
class ProductImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        images = request.FILES.getlist("images")
        created = []
        for i, img in enumerate(images):
            is_primary = (i == 0 and not product.images.filter(is_primary=True).exists())
            pi = ProductImage.objects.create(product=product, image=img, is_primary=is_primary)
            created.append(ProductImageSerializer(pi).data)
        return Response(created, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        image_id = request.data.get("image_id")
        try:
            img = ProductImage.objects.get(pk=image_id, product_id=pk)
            if img.image:
                file_path = os.path.join(settings.MEDIA_ROOT, str(img.image))
                if os.path.exists(file_path):
                    os.remove(file_path)
            img.delete()
            return Response({"message": "Image deleted."})
        except ProductImage.DoesNotExist:
            return Response({"error": "Image not found."}, status=status.HTTP_404_NOT_FOUND)


# ─── Admin: Stock + Discount ───────────────────────────────────────────────────
class UpdateStockView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            product = Product.objects.get(pk=pk)
            product.stock = request.data.get("stock", product.stock)
            product.save()
            return Response({"stock": product.stock})
        except Product.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class UpdateDiscountView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            product = Product.objects.get(pk=pk)
            # Send null to remove discount
            product.old_price = request.data.get("old_price")
            product.save()
            return Response(ProductSerializer(product).data)
        except Product.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# ─── Admin Inventory ──────────────────────────────────────────────────────────
class InventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        products = Product.objects.all().prefetch_related("images").select_related("category")
        data = []
        for p in products:
            data.append({
                "id":          p.id,
                "name":        p.name,
                "category":    p.category.name if p.category else None,
                "price":       p.price,
                "old_price":   p.old_price,
                "stock":       p.stock,
                "image_count": p.images.count(),
                "is_featured": p.is_featured,
                "low_stock":   p.stock <= 3,
            })
        return Response(data)


class LowStockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        products = Product.objects.filter(stock__lte=3)
        return Response(ProductSerializer(products, many=True).data)
