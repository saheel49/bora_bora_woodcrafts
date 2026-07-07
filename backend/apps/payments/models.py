from django.db import models
from apps.orders.models import Order


class Payment(models.Model):
    METHOD_CHOICES = [
        ("mpesa",  "M-Pesa"),
        ("paypal", "PayPal"),
        ("card",   "Card"),
    ]
    STATUS_CHOICES = [
        ("pending",  "Pending"),
        ("success",  "Success"),
        ("failed",   "Failed"),
    ]

    order          = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method         = models.CharField(max_length=10, choices=METHOD_CHOICES)
    amount         = models.DecimalField(max_digits=10, decimal_places=2)
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    transaction_id = models.CharField(max_length=200, blank=True)
    phone          = models.CharField(max_length=20, blank=True)
    paid_at        = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} — Order #{self.order.id} — {self.status}"
