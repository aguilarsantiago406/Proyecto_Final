from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('payments/', include('apps.payments.urls')),
    path('clients/', include('apps.clients.urls')),
    path('dashboard/', include('apps.dashboard.urls')),
    
]
