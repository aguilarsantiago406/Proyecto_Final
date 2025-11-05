from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/payments/', include('payments.urls')),
    path('api/auth/', include('auth_app.urls')),
    path('api/dashboard/', include('dashboard_api.urls')),
    path('api/core/', include('core.urls')),  # endpoints generales
]
