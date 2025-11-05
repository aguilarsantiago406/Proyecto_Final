from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    name = 'apps.payments'
    label = 'payments'  # mantener el label para reutilizar migraciones/tablas
    default_auto_field = 'django.db.models.BigAutoField'