from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect
from rest_framework_simplejwt.views import TokenRefreshView
from .admin_views import AdminStatsView

urlpatterns = [
    # Redirect root to React frontend
    path("", lambda request: HttpResponseRedirect(settings.CLIENT_URL)),

    path("admin/", admin.site.urls),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/",       include("apps.users.urls")),
    path("api/products/",   include("apps.products.urls")),
    path("api/orders/",     include("apps.orders.urls")),
    path("api/reviews/",    include("apps.reviews.urls")),
    path("api/wishlist/",   include("apps.wishlist.urls")),
    path("api/blog/",       include("apps.blog.urls")),
    path("api/contact/",    include("apps.contact.urls")),
    path("api/newsletter/", include("apps.newsletter.urls")),
    path("api/payments/",   include("apps.payments.urls")),
    path("api/admin/stats/", AdminStatsView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
