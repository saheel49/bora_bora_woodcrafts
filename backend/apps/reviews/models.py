from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    product_id = models.IntegerField()                   # references Product by id
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating     = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    text       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # One review per user per product
        unique_together = ["product_id", "user"]
        ordering        = ["-created_at"]

    def __str__(self):
        return f"Review by {self.user.email} on product #{self.product_id}"
