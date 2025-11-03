# payments/models.py

from django.db import models

class Payment(models.Model):
    appointment_id = models.CharField(max_length=100)
    contact_id = models.CharField(max_length=100)
    preference_id = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    description = models.CharField(max_length=255, null=True, blank=True)  
    
    # --- ¡NUEVO CAMPO CRÍTICO! ---
    # Indica si la notificación de pago APBADO fue enviada a GHL con éxito (código 200).
    ghl_notified = models.BooleanField(default=False)
    # -----------------------------
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.appointment_id} - {self.status}"
    

#nuevo modelo para registrar logs de auditoría del ejercicio 4    
class AuditLog(models.Model):
    event = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)

    def __str__(self):
        return f"[{self.timestamp}] {self.event}"