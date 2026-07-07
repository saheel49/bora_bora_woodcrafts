from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import OrderSerializer, CreateOrderSerializer, UpdateStatusSerializer
from .email_utils import send_order_receipt_to_admin, send_order_confirmation_to_customer, send_status_update_to_customer


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if getattr(request.user, "role", None) == "admin":
            return Response({"error": "Admins cannot place orders."}, status=status.HTTP_403_FORBIDDEN)

        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        items_data = data.pop("items")

        order = Order.objects.create(user=request.user, **data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        # Record initial status in history
        OrderStatusHistory.objects.create(order=order, status="Pending")

        # Send emails
        send_order_receipt_to_admin(order)
        send_order_confirmation_to_customer(order)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related(
            "items", "status_history"
        ).order_by("-created_at")
        return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related("items", "status_history").get(pk=pk)
            # Customer can only see own orders; admin sees all
            if request.user.role != "admin" and order.user != request.user:
                return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class OrderTrackingView(APIView):
    """Returns status history for live tracking — frontend polls this every 30s."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.prefetch_related("status_history").get(pk=pk)
            if request.user.role != "admin" and order.user != request.user:
                return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            all_stages = [
                "Pending", "Confirmed", "Processing",
                "Shipped", "Out for Delivery", "Delivered"
            ]
            history = {h.status: h.timestamp for h in order.status_history.all()}

            timeline = []
            for stage in all_stages:
                timeline.append({
                    "status":    stage,
                    "completed": stage in history,
                    "timestamp": history.get(stage),
                    "current":   stage == order.status,
                })

            return Response({
                "order_id":    order.id,
                "status":      order.status,
                "city":        order.city,
                "country":     order.country,
                "timeline":    timeline,
                "is_active":   order.status not in ["Delivered", "Cancelled"],
            })
        except Order.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class AllOrdersView(APIView):
    """Admin only — list all orders."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        orders = Order.objects.all().prefetch_related("items", "status_history").order_by("-created_at")
        return Response(OrderSerializer(orders, many=True).data)


class UpdateOrderStatusView(APIView):
    """Admin only — update order status."""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        try:
            order = Order.objects.get(pk=pk)
            serializer = UpdateStatusSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            order.status = serializer.validated_data["status"]
            order.save()

            # Record in history
            OrderStatusHistory.objects.create(
                order=order,
                status=order.status,
                note=serializer.validated_data.get("note", ""),
            )

            # Email customer
            send_status_update_to_customer(order)

            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
