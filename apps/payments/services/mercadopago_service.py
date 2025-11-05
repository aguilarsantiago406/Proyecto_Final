import time
import mercadopago
from django.conf import settings
import logging
import requests 
import os 

logger = logging.getLogger(__name__)

def get_sdk():
    """Inicializa el SDK de Mercado Pago de forma perezosa y segura."""
    token = None
    try:
        token = getattr(settings, 'MP_ACCESS_TOKEN', None)
    except Exception:
        token = None

    if not token:
        token = os.getenv("MP_ACCESS_TOKEN")

    if not isinstance(token, str) or not token.strip():
        raise ValueError("MP_ACCESS_TOKEN no configurado; define settings.MP_ACCESS_TOKEN o env MP_ACCESS_TOKEN")

    return mercadopago.SDK(token)


# ✅ Función para crear una preferencia de pago
def create_payment_preference(appointment_id, contact_id, amount, description):
    """Crea una preferencia de pago en Mercado Pago."""
    # ✅ CORRECCIÓN APLICADA: Busca la variable WEBHOOK_URL para coincidir con el .env
    notification_url = os.getenv("WEBHOOK_URL") 

    preference_data = {
        "items": [
            {
                "title": description,
                "quantity": 1,
                "unit_price": float(amount),
                "currency_id": "PEN"
            }
        ],
        "external_reference": f"appointment_{appointment_id}",
        "back_urls": {
            "success": "http://127.0.0.1:8000/payments/success",
            "failure": "http://127.0.0.1:8000/payments/failure",
            "pending": "http://127.0.0.1:8000/payments/pending"
        },
        "payment_methods": {
            "excluded_payment_methods": [],
            "excluded_payment_types": [],
            "installments": 1
        },
        "notification_url": notification_url # Usar la variable de entorno
    }

    print("📦 Enviando a Mercado Pago:", preference_data)

    sdk = get_sdk()
    response = sdk.preference().create(preference_data)
    status = response.get("status")
    body = response.get("response", {})

    print("⚙️ Mercado Pago response status:", status)

    if status != 201:
        logger.error(f"❌ Error creando preferencia: {body}")
        raise Exception(f"❌ Error creando preferencia: {body}")

    return {
        "preference_id": body.get("id"),
        # Usamos 'init_point' (Producción)
        "init_point": body.get("init_point") 
    }


# ✅ Función para verificar el estado de un pago (solo como referencia/backup)
def check_payment_status(payment_id, max_retries=3, delay=2):
    """
    Verifica el estado del pago con reintentos.
    NOTA: En el webhook no usamos esta función con reintentos, consultamos directamente.
    """
    for attempt in range(max_retries):
        try:
            sdk = get_sdk()
            response = sdk.payment().get(payment_id) 

            if response.get("status") == 200:
                return response["response"]
            
        except Exception as e:
            error = getattr(e, 'args', [None])[0]
            if isinstance(error, dict) and error.get("status") == 404:
                 print(f"🚫 Pago no encontrado aún (404). Reintentando en {delay} segundos...")
            else:
                 print("❌ Error al consultar el pago:", e)
                 break

        time.sleep(delay)

    return None