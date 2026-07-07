from django.urls import path
from .views import MpesaInitiateView, MpesaCallbackView, PayPalPlaceholderView, CardPlaceholderView

urlpatterns = [
    path("mpesa/initiate/",  MpesaInitiateView.as_view()),
    path("mpesa/callback/",  MpesaCallbackView.as_view()),
    path("paypal/",          PayPalPlaceholderView.as_view()),
    path("card/",            CardPlaceholderView.as_view()),
]
