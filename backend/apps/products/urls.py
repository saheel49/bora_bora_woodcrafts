from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    ProductListCreateView, ProductDetailView,
    ProductImageUploadView, UpdateStockView,
    UpdateDiscountView, InventoryView, LowStockView,
)

urlpatterns = [
    path("",                       ProductListCreateView.as_view()),
    path("<int:pk>/",              ProductDetailView.as_view()),
    path("<int:pk>/images/",       ProductImageUploadView.as_view()),
    path("<int:pk>/stock/",        UpdateStockView.as_view()),
    path("<int:pk>/discount/",     UpdateDiscountView.as_view()),
    path("categories/",            CategoryListCreateView.as_view()),
    path("categories/<int:pk>/",   CategoryDetailView.as_view()),
    path("inventory/",             InventoryView.as_view()),
    path("inventory/low-stock/",   LowStockView.as_view()),
]
