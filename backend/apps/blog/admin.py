from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display   = ["title", "author", "category", "is_published", "created_at"]
    list_filter    = ["is_published", "category"]
    search_fields  = ["title", "author__email"]
    list_editable  = ["is_published"]
    prepopulated_fields = {"slug": ("title",)}
