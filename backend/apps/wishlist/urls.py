from django.urls import path
from .views import WishlistView

urlpatterns = [
    path("",                    WishlistView.as_view()),               # GET all
    path("<int:product_id>/",   WishlistView.as_view()),               # POST add / DELETE remove
]
