# payments/utils/audit.py

from datetime import datetime
from payments.models import AuditLog

def log_event(event, user_id=None, details=None):
    """
    Guarda un evento en la tabla AuditLog.
    Siempre intenta registrar el detalle del evento.
    """
    try:
        AuditLog.objects.create(
            event=event,
            user_id=str(user_id) if user_id else None,
            details=details or {},
            timestamp=datetime.now()
        )
        print(f"🧾 Log registrado: {event} (user={user_id})")
    except Exception as e:
        # Evita que un error de auditoría interrumpa la ejecución del webhook
        print(f"⚠️ Error registrando log: {e}")
