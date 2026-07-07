from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ["username", "email", "first_name", "last_name", "role", "is_active", "created_at"]
    list_filter   = ["role", "is_active"]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering      = ["-created_at"]
    fieldsets = (
        (None,           {"fields": ("username", "email", "password")}),
        ("Personal",     {"fields": ("first_name", "last_name", "phone", "address")}),
        ("Permissions",  {"fields": ("role", "is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (None, {"fields": ("username", "email", "first_name", "last_name", "password1", "password2", "role")}),
    )
