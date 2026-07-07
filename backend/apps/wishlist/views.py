from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.products.models import Product
from .models import WishlistItem
from .serializers import WishlistItemSerializer


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).select_related("product")
        return Response(WishlistItemSerializer(items, many=True).data)

    def post(self, request, product_id):
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        if not created:
            return Response({"message": "Already in wishlist."})
        return Response(WishlistItemSerializer(item).data, status=status.HTTP_201_CREATED)

    def delete(self, request, product_id):
        try:
            item = WishlistItem.objects.get(user=request.user, product_id=product_id)
            item.delete()
            return Response({"message": "Removed from wishlist."})
        except WishlistItem.DoesNotExist:
            return Response({"error": "Not in wishlist."}, status=status.HTTP_404_NOT_FOUND)
