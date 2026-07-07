from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name              = models.CharField(max_length=200)
    category          = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    price             = models.DecimalField(max_digits=10, decimal_places=2)
    old_price         = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    short_description = models.CharField(max_length=300, blank=True)
    description       = models.TextField(blank=True)
    stock             = models.PositiveIntegerField(default=0)
    rating            = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count      = models.PositiveIntegerField(default=0)
    is_featured       = models.BooleanField(default=False)
    is_best_seller    = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    # Images saved locally to client/public/images/
    product   = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    # Images saved locally to client/public/images/ — stored as file path
    image      = models.FileField(upload_to="")   # MEDIA_ROOT is client/public/images
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"
