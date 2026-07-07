from django.db import models
from django.conf import settings


STATUS_CHOICES = [
    ("Pending",          "Pending"),
    ("Confirmed",        "Confirmed"),
    ("Processing",       "Processing"),
    ("Shipped",          "Shipped"),
    ("Out for Delivery", "Out for Delivery"),
    ("Delivered",        "Delivered"),
    ("Cancelled",        "Cancelled"),
]

PAYMENT_CHOICES = [
    ("mpesa",  "M-Pesa"),
    ("paypal", "PayPal"),
    ("card",   "Card"),
]


class Order(models.Model):
    user           = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default="mpesa")
    subtotal       = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total          = models.DecimalField(max_digits=10, decimal_places=2)
    # Delivery details
    first_name     = models.CharField(max_length=100)
    last_name      = models.CharField(max_length=100)
    email          = models.EmailField()
    phone          = models.CharField(max_length=20)
    address        = models.TextField()
    city           = models.CharField(max_length=100)
    country        = models.CharField(max_length=100)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} — {self.user.email} — {self.status}"


class OrderItem(models.Model):
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_id = models.IntegerField()
    name       = models.CharField(max_length=200)
    price      = models.DecimalField(max_digits=10, decimal_places=2)
    quantity   = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity}x {self.name}"


class OrderStatusHistory(models.Model):
    """Tracks every status change with a timestamp for live tracking."""
    order      = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES)
    timestamp  = models.DateTimeField(auto_now_add=True)
    note       = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"Order #{self.order.id} → {self.status}"
