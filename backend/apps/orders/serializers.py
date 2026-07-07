from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ["id", "product_id", "name", "price", "quantity"]


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderStatusHistory
        fields = ["status", "timestamp", "note"]


class OrderSerializer(serializers.ModelSerializer):
    items          = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)
    user_email     = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model  = Order
        fields = [
            "id", "user_email", "status", "payment_method",
            "subtotal", "shipping_cost", "total",
            "first_name", "last_name", "email", "phone",
            "address", "city", "country",
            "items", "status_history", "created_at",
        ]
        read_only_fields = ["id", "status", "created_at", "user_email"]


class CreateOrderSerializer(serializers.Serializer):
    """Used when customer submits checkout form."""
    first_name     = serializers.CharField()
    last_name      = serializers.CharField()
    email          = serializers.EmailField()
    phone          = serializers.CharField()
    address        = serializers.CharField()
    city           = serializers.CharField()
    country        = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=["mpesa", "paypal", "card"])
    subtotal       = serializers.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost  = serializers.DecimalField(max_digits=10, decimal_places=2)
    total          = serializers.DecimalField(max_digits=10, decimal_places=2)
    items          = OrderItemSerializer(many=True)


class UpdateStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        "Pending", "Confirmed", "Processing",
        "Shipped", "Out for Delivery", "Delivered", "Cancelled"
    ])
    note = serializers.CharField(required=False, allow_blank=True)
