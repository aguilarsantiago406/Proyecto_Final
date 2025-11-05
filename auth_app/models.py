from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    # Puedes agregar campos extra si quieres
    pass


class Client(models.Model):
    """
    Representa una integración cliente/cliente-agencia.
    Guarda tokens GHL y Mercado Pago por cliente.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, blank=True, help_text="Nombre del cliente/agencia")
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # GHL
    ghl_location_id = models.CharField(max_length=200, null=True, blank=True)
    ghl_access_token = models.TextField(null=True, blank=True)
    ghl_refresh_token = models.TextField(null=True, blank=True)

    # Mercado Pago (OAuth)
    mp_user_id = models.CharField(max_length=200, null=True, blank=True)
    mp_access_token = models.TextField(null=True, blank=True)
    mp_refresh_token = models.TextField(null=True, blank=True)

    meta = models.JSONField(default=dict, blank=True, null=True)

    def __str__(self):
        return f"{self.name or self.email or 'Client'} ({self.id})"
