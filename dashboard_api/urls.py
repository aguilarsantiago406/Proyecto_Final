# dashboard_api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("summary/", views.summary, name="dashboard_summary"),
    path("payments/", views.payments_list, name="dashboard_payments"),
    path("export/", views.export_report, name="dashboard_export"),
]
