# payments/utils/idempotency.py

from payments.models import Payment

def get_or_create_payment_status(payment_id, defaults=None):
    """
    Busca o crea el objeto Payment. Útil para la lógica de webhooks.
    """
    try:
        payment, created = Payment.objects.get_or_create(
            payment_id=payment_id,
            defaults=defaults or {}
        )
        return payment, created
    except Exception as e:
        # Maneja cualquier error de base de datos o de consulta
        print(f"⚠️ Error al buscar/crear pago: {e}")
        return None, False

def should_process_ghl(payment_object):
    """
    Verifica si se debe intentar la notificación a GHL.
    Retorna True si el pago está aprobado Y GHL aún NO ha sido notificado.
    """
    # Asume que tu estado de pago aprobado es 'approved' o 'paid'
    if payment_object.status in ["approved", "paid"] and not payment_object.ghl_notified:
        return True
    return False