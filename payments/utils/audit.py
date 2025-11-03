from ..models import AuditLog
from datetime import datetime

def log_event(event, user_id=None, details=None):
    """
    Guarda un evento en la tabla AuditLog.
    """
    try:
        AuditLog.objects.create(
            event=event,
            user_id=str(user_id) if user_id else None,
            details=details or {}
        )
        print(f"✅ Log guardado: {event}")
    except Exception as e:
        print(f"❌ Error guardando log: {e}")
