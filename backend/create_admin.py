"""
Run this once after migrations to create the admin user:
    python create_admin.py
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "borabora.settings")
django.setup()

from apps.users.models import User

if not User.objects.filter(username="Saheel").exists():
    user = User.objects.create_superuser(
        username="Saheel",
        email="saheelamir49@gmail.com",
        password="Saheel@2026",
        first_name="Saheel",
        last_name="Amir",
    )
    user.role = "admin"
    user.save()
    print("✅ Admin created — username: Saheel | password: Saheel@2026")
else:
    print("ℹ️  Admin already exists.")
