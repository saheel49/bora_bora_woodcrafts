from django.urls import path
from .views import (
    CreateOrderView, MyOrdersView, OrderDetailView,
    OrderTrackingView, AllOrdersView, UpdateOrderStatusView,
)

urlpatterns = [
    path("",                      CreateOrderView.as_view()),   # POST create
    path("my/",                   MyOrdersView.as_view()),       # GET my orders
    path("all/",                  AllOrdersView.as_view()),      # GET admin all
    path("<int:pk>/",             OrderDetailView.as_view()),    # GET single
    path("<int:pk>/tracking/",    OrderTrackingView.as_view()),  # GET tracking
    path("<int:pk>/status/",      UpdateOrderStatusView.as_view()), # PUT admin
]
