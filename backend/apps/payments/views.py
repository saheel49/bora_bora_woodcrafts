import json
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.orders.models import Order, OrderStatusHistory
from .models import Payment


class MpesaInitiateView(APIView):
    """
    Initiates M-Pesa STK Push.
    TODO: Integrate Safaricom Daraja API when credentials are available.
    Currently logs the request and creates a pending payment record.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        phone    = request.data.get("phone", "").strip()

        if not order_id or not phone:
            return Response(
                {"error": "order_id and phone are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(pk=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create pending payment record
        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={"method": "mpesa", "amount": order.total, "phone": phone}
        )

        # ── TODO: Replace this block with real Daraja STK Push ──────────────
        # import requests, base64
        # from datetime import datetime
        # Access token → POST https://sandbox.safaricom.co.ke/oauth/v1/generate
        # STK Push     → POST https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
        # ────────────────────────────────────────────────────────────────────

        return Response({
            "message": "M-Pesa STK Push initiated. Check your phone.",
            "order_id": order.id,
            "amount":   str(order.total),
            "phone":    phone,
        })


@method_decorator(csrf_exempt, name="dispatch")
class MpesaCallbackView(APIView):
    """
    Receives Safaricom payment confirmation webhook.
    Safaricom calls this URL after the customer completes payment.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            # Safaricom sends result in Body.stkCallback
            callback  = data.get("Body", {}).get("stkCallback", {})
            result_code = callback.get("ResultCode")
            metadata    = callback.get("CallbackMetadata", {}).get("Item", [])

            # Extract transaction details
            tx_id  = next((i["Value"] for i in metadata if i["Name"] == "MpesaReceiptNumber"), "")
            amount = next((i["Value"] for i in metadata if i["Name"] == "Amount"), 0)
            phone  = next((i["Value"] for i in metadata if i["Name"] == "PhoneNumber"), "")

            if result_code == 0:
                # Payment successful — find order by matching amount + pending payment
                try:
                    payment = Payment.objects.filter(
                        status="pending", method="mpesa", amount=amount
                    ).latest("created_at")

                    payment.status         = "success"
                    payment.transaction_id = tx_id
                    payment.paid_at        = timezone.now()
                    payment.save()

                    # Update order status to Confirmed
                    order = payment.order
                    order.status = "Confirmed"
                    order.save()
                    OrderStatusHistory.objects.create(
                        order=order,
                        status="Confirmed",
                        note=f"M-Pesa payment received. Ref: {tx_id}",
                    )
                except Payment.DoesNotExist:
                    pass

        except Exception:
            pass  # Always return 200 to Safaricom

        return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class PayPalPlaceholderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # TODO: Integrate PayPal SDK
        return Response({"message": "PayPal integration coming soon."})


class CardPlaceholderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # TODO: Integrate Stripe
        return Response({"message": "Card payment (Stripe) coming soon."})
