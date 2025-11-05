import time
import mercadopago
from django.conf import settings
import logging
import requests
import os

from payments.utils.audit import log_event  # 👈 Auditoría
from payments.models import Payment  # 👈 Para registrar y asociar pagos en DB

logger = logging.getLogger(__name__)

# Inicializar SDK de Mercado Pago
try:
    sdk = mercadopago.SDK(settings.MP_ACCESS_TOKEN)
except AttributeError:
    # Fallback para Docker u otros entornos donde settings no esté inicializado
    sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))


# ✅ CREAR UNA PREFERENCIA DE PAGO
def create_payment_preference(appointment_id, contact_id, amount, description):
    """
    Crea una preferencia de pago en Mercado Pago y registra el evento en auditoría.
    """
    notification_url = os.getenv("WEBHOOK_URL")

    preference_data = {
        "items": [
            {
                "title": description or "Pago de servicio",
                "quantity": 1,
                "unit_price": float(amount),
                "currency_id": "PEN",
            }
        ],
        "external_reference": f"appointment_{appointment_id}",
        "back_urls": {
            "success": "http://127.0.0.1:8000/payments/success",
            "failure": "http://127.0.0.1:8000/payments/failure",
            "pending": "http://127.0.0.1:8000/payments/pending",
        },
        "payment_methods": {
            "excluded_payment_methods": [],
            "excluded_payment_types": [],
            "installments": 1,
        },
        "notification_url": notification_url,
    }

    print("📦 Enviando a Mercado Pago:", preference_data)

    response = sdk.preference().create(preference_data)
    status = response.get("status")
    body = response.get("response", {})

    print("⚙️ Mercado Pago response status:", status)

    if status != 201:
        logger.error(f"❌ Error creando preferencia: {body}")
        log_event(
            event="ERROR_CREATE_PREFERENCE",
            user_id=contact_id,
            details={"appointment_id": appointment_id, "error": body},
        )
        raise Exception(f"❌ Error creando preferencia: {body}")

    # 🧾 Registrar evento de éxito
    log_event(
        event="CREATE_PAYMENT_PREFERENCE",
        user_id=contact_id,
        details={
            "appointment_id": appointment_id,
            "amount": amount,
            "description": description,
            "preference_id": body.get("id"),
        },
    )

    return {
        "preference_id": body.get("id"),
        "init_point": body.get("init_point"),  # Producción
    }


# ✅ CONSULTAR EL ESTADO DE UN PAGO
def check_payment_status(payment_id, max_retries=3, delay=2):
    """
    Consulta el estado de un pago con reintentos.
    También registra el evento en la auditoría.
    """
    for attempt in range(max_retries):
        try:
            response = sdk.payment().get(payment_id)

            if response.get("status") == 200:
                payment_info = response["response"]
                log_event(
                    event="CHECK_PAYMENT_STATUS_SUCCESS",
                    details={
                        "payment_id": payment_id,
                        "status": payment_info.get("status"),
                        "amount": payment_info.get("transaction_amount"),
                    },
                )
                return payment_info

        except Exception as e:
            error = getattr(e, "args", [None])[0]
            if isinstance(error, dict) and error.get("status") == 404:
                print(f"🚫 Pago no encontrado (404). Reintentando en {delay}s...")
                log_event(
                    event="CHECK_PAYMENT_STATUS_NOT_FOUND",
                    details={"payment_id": payment_id, "attempt": attempt + 1},
                )
            else:
                print("❌ Error al consultar el pago:", e)
                log_event(
                    event="CHECK_PAYMENT_STATUS_ERROR",
                    details={"payment_id": payment_id, "error": str(e)},
                )
                break

        time.sleep(delay)

    return None
