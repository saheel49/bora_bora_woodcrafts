from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model  = Review
        fields = ["id", "product_id", "author_id", "author_name", "rating", "text", "created_at"]
        read_only_fields = ["id", "author_name", "created_at"]

    def get_author_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name[0]}."


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Review
        fields = ["rating", "text"]
