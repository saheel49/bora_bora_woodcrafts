from rest_framework import serializers
from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_id   = serializers.IntegerField(source="author.id", read_only=True)
    image_url   = serializers.SerializerMethodField()

    class Meta:
        model  = BlogPost
        fields = [
            "id", "title", "slug", "excerpt", "content",
            "author_id", "author_name", "category", "image_url",
            "is_published", "read_time", "created_at",
        ]
        read_only_fields = ["id", "slug", "author_id", "author_name", "created_at"]

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"

    def get_image_url(self, obj):
        if not obj.image:
            return None
        # Try to return absolute URL when request is available in serializer context
        try:
            url = obj.image.url
        except Exception:
            url = None

        request = self.context.get("request") if hasattr(self, "context") else None
        if url and request:
            try:
                return request.build_absolute_uri(url)
            except Exception:
                pass

        if url:
            return url

        from django.conf import settings
        return (getattr(settings, "MEDIA_URL", "/media/") or "/media/") + (obj.image.name or "")


class CreateBlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BlogPost
        fields = ["title", "content", "excerpt", "category", "image", "read_time"]
