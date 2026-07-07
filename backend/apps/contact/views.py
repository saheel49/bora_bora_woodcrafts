from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        msg = serializer.save()

        # Notify admin
        send_mail(
            subject=f"Contact Form: {msg.subject}",
            message=f"From: {msg.name} <{msg.email}>\n\n{msg.message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
        )

        # Auto-reply to sender
        send_mail(
            subject="We received your message — BoraBora Woodcrafts",
            message=f"Hi {msg.name},\n\nThank you for reaching out! We've received your message and will get back to you within 1–2 business days.\n\n— BoraBora Woodcrafts",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[msg.email],
            fail_silently=True,
        )

        return Response({"message": "Message sent successfully."}, status=status.HTTP_201_CREATED)

    def get(self, request):
        """Admin only — view all messages."""
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        messages = ContactMessage.objects.all()
        return Response(ContactMessageSerializer(messages, many=True).data)
