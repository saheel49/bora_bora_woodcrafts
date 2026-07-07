from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .models import BlogPost
from .serializers import BlogPostSerializer, CreateBlogPostSerializer
import hashlib
import os
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


class BlogListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Admin with ?all=true sees everything
        if (request.user.is_authenticated
                and request.user.role == "admin"
                and request.query_params.get("all") == "true"):
            posts = BlogPost.objects.all().select_related("author").order_by("-created_at")
            return Response(BlogPostSerializer(posts, many=True, context={"request": request}).data)

        # Logged-in user: their own posts (published + draft) first,
        # then other users' published posts.
        if request.user.is_authenticated:
            from django.db.models import Q, When, Case, IntegerField, Value
            posts = (
                BlogPost.objects.filter(
                    Q(author=request.user) | Q(is_published=True)
                )
                .select_related("author")
                .annotate(
                    is_owner=Case(
                        When(author=request.user, then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField(),
                    )
                )
                .order_by("-is_owner", "-created_at")
                .distinct()
            )
            return Response(BlogPostSerializer(posts, many=True, context={"request": request}).data)

        # Anonymous: only published posts
        posts = BlogPost.objects.filter(is_published=True).select_related("author").order_by("-created_at")
        return Response(BlogPostSerializer(posts, many=True, context={"request": request}).data)


class BlogDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            post = BlogPost.objects.get(slug=slug)
            # Allow: published posts (anyone), own posts (author), any post (admin)
            if (post.is_published
                    or (request.user.is_authenticated and post.author == request.user)
                    or (request.user.is_authenticated and request.user.role == "admin")):
                return Response(BlogPostSerializer(post, context={"request": request}).data)
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
        except BlogPost.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)


class CreateBlogPostView(APIView):
    """Logged-in users can submit a post — admin must publish it."""
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        # Handle uploaded image: dedupe by content hash and store as content-addressed filename
        image_file = request.FILES.get("image")
        image_name = None
        if image_file:
            content = image_file.read()
            h = hashlib.sha256(content).hexdigest()
            ext = os.path.splitext(image_file.name)[1].lower() or ".jpg"
            image_name = os.path.join("blog_images", f"{h}{ext}")
            if not default_storage.exists(image_name):
                default_storage.save(image_name, ContentFile(content))
            # reset pointer (not strictly needed since we used content)

        serializer = CreateBlogPostSerializer(data=request.data)
        if serializer.is_valid():
            # If deduped image_name exists, pass its storage path (relative name) to the model
            if image_name:
                post = serializer.save(author=request.user, is_published=False, image=image_name)
            else:
                post = serializer.save(author=request.user, is_published=False)
            return Response(BlogPostSerializer(post, context={"request": request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogPostManageView(APIView):
    """Author can edit/delete their own post. Admin can do anything."""
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            post = BlogPost.objects.get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if post.author != request.user and request.user.role != "admin":
            return Response({"error": "Not authorised."}, status=status.HTTP_403_FORBIDDEN)

        # Handle image dedupe when updating
        image_file = request.FILES.get("image")
        image_name = None
        if image_file:
            content = image_file.read()
            h = hashlib.sha256(content).hexdigest()
            ext = os.path.splitext(image_file.name)[1].lower() or ".jpg"
            image_name = os.path.join("blog_images", f"{h}{ext}")
            if not default_storage.exists(image_name):
                default_storage.save(image_name, ContentFile(content))

        serializer = CreateBlogPostSerializer(post, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            if image_name:
                serializer.save(image=image_name)
            else:
                serializer.save()
            # Handle explicit removal request
            if request.data.get("remove_image") in ("1", "true", "True", True):
                try:
                    if getattr(post, 'image', None):
                        default_storage.delete(post.image.name)
                except Exception:
                    pass
                post.image = None
                post.save()
            return Response(BlogPostSerializer(post, context={"request": request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            post = BlogPost.objects.get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if post.author != request.user and request.user.role != "admin":
            return Response({"error": "Not authorised."}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted."})


class PublishBlogPostView(APIView):
    """Admin only — approve and publish a submitted post."""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            post = BlogPost.objects.get(pk=pk)
            post.is_published = True
            post.save()
            return Response(BlogPostSerializer(post, context={"request": request}).data)
        except BlogPost.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class UnpublishBlogPostView(APIView):
    """Admin only — unpublish a post (move back to draft)."""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            post = BlogPost.objects.get(pk=pk)
            post.is_published = False
            post.save()
            return Response(BlogPostSerializer(post, context={"request": request}).data)
        except BlogPost.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class MyBlogPostsView(APIView):
    """Logged-in users can see all their own posts (draft + published)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = BlogPost.objects.filter(author=request.user).order_by("-created_at")
        return Response(BlogPostSerializer(posts, many=True, context={"request": request}).data)
