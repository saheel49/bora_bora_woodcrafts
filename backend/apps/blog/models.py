from django.db import models
from django.conf import settings
from django.utils.text import slugify


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ("Techniques",   "Techniques"),
        ("Sustainability","Sustainability"),
        ("Product Care", "Product Care"),
        ("News",         "News"),
        ("Other",        "Other"),
    ]

    title        = models.CharField(max_length=200)
    slug         = models.SlugField(unique=True, blank=True)
    content      = models.TextField()
    excerpt      = models.CharField(max_length=400, blank=True)
    author       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blog_posts")
    category     = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="Other")
    image        = models.FileField(upload_to="", blank=True, null=True)
    is_published = models.BooleanField(default=False)
    read_time    = models.CharField(max_length=20, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
