from django.db import models


class Payment(models.Model):
    """
    Representa un pago asociado a una cita (appointment) y un contacto de GHL.
    Sincroniza su estado con Mercado Pago.
    """
    appointment_id = models.CharField(max_length=100)
    contact_id = models.CharField(max_length=100)
    preference_id = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    description = models.CharField(max_length=255, null=True, blank=True)

    # --- Campo crítico para idempotencia con GHL ---
    ghl_notified = models.BooleanField(default=False)

    # --- Fechas ---
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # 👈 Añadido (buena práctica)

    def __str__(self):
        return f"{self.appointment_id} - {self.status}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment"
        verbose_name_plural = "Payments"


class AuditLog(models.Model):
    """
    Registro de eventos de auditoría del sistema (creación de pagos, errores, webhooks, etc.).
    """
    event = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)

    def __str__(self):
        return f"[{self.timestamp:%Y-%m-%d %H:%M:%S}] {self.event}"

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
