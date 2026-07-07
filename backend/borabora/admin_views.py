from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.orders.models import Order
from apps.products.models import Product
from apps.users.models import User
from apps.blog.models import BlogPost
from apps.contact.models import ContactMessage


class AdminStatsView(APIView):
    """Dashboard stats — admin only."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=403)

        total_revenue = Order.objects.filter(
            status="Delivered"
        ).aggregate(total=Sum("total"))["total"] or 0

        stats = {
            "total_orders":      Order.objects.count(),
            "pending_orders":    Order.objects.filter(status="Pending").count(),
            "total_revenue":     float(total_revenue),
            "total_products":    Product.objects.count(),
            "low_stock_count":   Product.objects.filter(stock__lte=3).count(),
            "out_of_stock":      Product.objects.filter(stock=0).count(),
            "total_users":       User.objects.filter(role="customer").count(),
            "total_blog_posts":  BlogPost.objects.count(),
            "unread_messages":   ContactMessage.objects.filter(is_read=False).count(),
        }

        recent_orders = Order.objects.order_by("-created_at")[:10].values(
            "id", "first_name", "last_name", "email", "total", "status", "created_at"
        )

        return Response({
            "stats":         stats,
            "recent_orders": list(recent_orders),
        })
