from django.db.models import Avg
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.products.models import Product
from .models import Review
from .serializers import ReviewSerializer, CreateReviewSerializer


class ProductReviewsView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id).select_related("user")
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, product_id):
        # Check product exists
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check not already reviewed
        if Review.objects.filter(product_id=product_id, user=request.user).exists():
            return Response({"error": "You have already reviewed this product."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            product_id=product_id,
            user=request.user,
            **serializer.validated_data,
        )

        # Update product average rating
        avg = Review.objects.filter(product_id=product_id).aggregate(avg=Avg("rating"))["avg"] or 0
        product.rating       = round(avg, 2)
        product.review_count = Review.objects.filter(product_id=product_id).count()
        product.save()

        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

    def put(self, request, product_id):
        try:
            review = Review.objects.get(product_id=product_id, user=request.user)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CreateReviewSerializer(review, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        try:
            product = Product.objects.get(pk=product_id)
            avg = Review.objects.filter(product_id=product_id).aggregate(avg=Avg("rating"))["avg"] or 0
            product.rating = round(avg, 2)
            product.review_count = Review.objects.filter(product_id=product_id).count()
            product.save()
        except Product.DoesNotExist:
            pass

        return Response(ReviewSerializer(review).data)


class DeleteReviewView(APIView):
    """Admin or owner can delete a review."""
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)

        if review.user != request.user and request.user.role != "admin":
            return Response({"error": "Not authorised."}, status=status.HTTP_403_FORBIDDEN)
        product_id = review.product_id
        review.delete()
        # Recalculate rating
        try:
            product = Product.objects.get(pk=product_id)
            avg = Review.objects.filter(product_id=product_id).aggregate(avg=Avg("rating"))["avg"] or 0
            product.rating       = round(avg, 2)
            product.review_count = Review.objects.filter(product_id=product_id).count()
            product.save()
        except Product.DoesNotExist:
            pass
        return Response({"message": "Review deleted."})
