from django.urls import path
from .views import ProductReviewsView, DeleteReviewView

urlpatterns = [
    path("products/<int:product_id>/", ProductReviewsView.as_view()),
    path("<int:pk>/",                  DeleteReviewView.as_view()),
]
