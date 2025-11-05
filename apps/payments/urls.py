# payments/urls.py

from django.urls import path
from . import views
from .webhooks import mp_webhook, ghl_callback, mp_callback  # ✅ webhooks y callbacks

urlpatterns = [
    path("create/", views.create_payment, name="create_payment"),
    path("webhooks/mp/", mp_webhook, name="mp_webhook"),
    path("oauth/callback/ghl/", ghl_callback, name="ghl_callback"),
    path("oauth/callback/mp/", mp_callback, name="mp_callback"),
    path('', views.list_payments, name='list_payments'),#para que frontend pueda listar los pagos 
    path('logs/', views.list_logs, name='list_logs'), #nuevo endpoint para listar logs de auditoría
]
