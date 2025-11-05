from django.urls import path
from . import views, webhooks

urlpatterns = [
    # Pagos
    path("create/", views.create_payment, name="create_payment"),
    path("list/", views.list_payments, name="list_payments"),

    # Logs
    path("logs/", views.list_logs, name="list_logs"),

    # Webhooks
    path("webhooks/mp/", webhooks.mp_webhook, name="mp_webhook"),
    path("oauth/callback/ghl/", webhooks.ghl_callback, name="ghl_callback"),
]
