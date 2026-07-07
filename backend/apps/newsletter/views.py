from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import NewsletterSubscriber


class NewsletterView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        _, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created:
            return Response({"message": "Already subscribed."})
        return Response({"message": "Subscribed successfully!"}, status=status.HTTP_201_CREATED)

    def get(self, request):
        """Admin only — list all subscribers."""
        if request.user.role != "admin":
            return Response({"error": "Admin only."}, status=status.HTTP_403_FORBIDDEN)
        subs = NewsletterSubscriber.objects.all().values("email", "subscribed_at")
        return Response(list(subs))
