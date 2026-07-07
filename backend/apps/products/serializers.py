from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model  = Category
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = ProductImage
        fields = ["id", "image_url", "is_primary"]

    def get_image_url(self, obj):
        # Return path relative to /images/ so React can use it directly
        return f"/images/{obj.image.name}" if obj.image else None


class ProductSerializer(serializers.ModelSerializer):
    images      = ProductImageSerializer(many=True, read_only=True)
    category    = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )

    class Meta:
        model  = Product
        fields = [
            "id", "name", "category", "category_id", "price", "old_price",
            "short_description", "description", "stock", "rating", "review_count",
            "is_featured", "is_best_seller", "images", "created_at",
        ]
        read_only_fields = ["rating", "review_count", "created_at"]
