from django.urls import path
from .views import (
    RegisterView, LoginView, MeView,
    ChangePasswordView, ForgotPasswordView, ResetPasswordView,
    CustomerListView,
)

urlpatterns = [
    path("register/",        RegisterView.as_view()),
    path("login/",           LoginView.as_view()),
    path("me/",              MeView.as_view()),
    path("password/",        ChangePasswordView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/",  ResetPasswordView.as_view()),
    path("customers/",       CustomerListView.as_view()),
]
