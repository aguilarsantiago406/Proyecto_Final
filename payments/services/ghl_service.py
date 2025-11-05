# payments/services/ghl_service.py

import requests
import os
import json
from payments.utils.audit import log_event  # 👈 para registrar auditoría

# Variables de entorno
GHL_TOKEN = os.getenv("GHL_TOKEN")
GHL_LOCATION_ID = os.getenv("GHL_LOCATION_ID")

def send_ghl_payment_update(contact_id, appointment_id, amount):
    """
    Envía una etiqueta o actualización de pago aprobado a un contacto en GoHighLevel (GHL).
    Registra el resultado en el log de auditoría.
    Retorna True si el envío fue exitoso.
    """
    if not GHL_TOKEN:
        print("❌ Clave API de GHL (GHL_TOKEN) no configurada.")
        log_event("GHL_ERROR", user_id=contact_id, details={"reason": "missing GHL_TOKEN"})
        return False

    TAG_TO_APPLY = "Pago Aprobado MP"
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}"

    headers = {
        "Authorization": f"Bearer {GHL_TOKEN}",
        "Content-Type": "application/json",
        "Version": "2021-04-15"
    }

    # Si tu integración requiere LOCATION_ID, puedes incluirlo aquí:
    if GHL_LOCATION_ID:
        headers["LocationId"] = GHL_LOCATION_ID

    payload = {"tags": [TAG_TO_APPLY]}

    print(f"📡 Enviando Tag '{TAG_TO_APPLY}' a Contacto GHL: {contact_id}...")

    try:
        response = requests.put(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()

        print(f"✅ Contacto {contact_id} etiquetado correctamente en GHL.")
        log_event(
            "GHL_NOTIFICATION_SUCCESS",
            user_id=contact_id,
            details={
                "appointment_id": appointment_id,
                "amount": amount,
                "tag": TAG_TO_APPLY,
                "status_code": response.status_code,
            },
        )
        return True

    except requests.exceptions.HTTPError as e:
        print(f"❌ Error HTTP GHL: {e}")
        print(f"🧾 Cuerpo de respuesta: {response.text}")
        log_event(
            "GHL_NOTIFICATION_FAILED",
            user_id=contact_id,
            details={
                "appointment_id": appointment_id,
                "amount": amount,
                "error": str(e),
                "response": response.text,
            },
        )
        return False

    except Exception as e:
        print(f"❌ Error general de GHL: {e}")
        log_event(
            "GHL_NOTIFICATION_ERROR",
            user_id=contact_id,
            details={
                "appointment_id": appointment_id,
                "amount": amount,
                "error": str(e),
            },
        )
        return False
