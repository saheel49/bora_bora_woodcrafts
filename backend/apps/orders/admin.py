from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model  = OrderItem
    extra  = 0
    readonly_fields = ["product_id", "name", "price", "quantity"]


class OrderStatusHistoryInline(admin.TabularInline):
    model  = OrderStatusHistory
    extra  = 0
    readonly_fields = ["status", "timestamp", "note"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display   = ["id", "user", "status", "total", "city", "country", "created_at"]
    list_filter    = ["status", "payment_method", "country"]
    search_fields  = ["email", "first_name", "last_name", "phone"]
    readonly_fields = ["created_at"]
    inlines        = [OrderItemInline, OrderStatusHistoryInline]
