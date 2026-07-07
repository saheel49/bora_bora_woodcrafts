from django.contrib import admin
from .models import Category, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display   = ["name", "category", "price", "old_price", "stock", "is_featured", "is_best_seller"]
    list_filter    = ["category", "is_featured", "is_best_seller"]
    search_fields  = ["name"]
    list_editable  = ["price", "old_price", "stock", "is_featured", "is_best_seller"]
    inlines        = [ProductImageInline]
