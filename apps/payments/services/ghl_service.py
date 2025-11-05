# services/ghl_service.py

import requests
import os
import json
# Variables de entorno: Asume que usas GHL_TOKEN en tu .env
GHL_TOKEN = os.getenv("GHL_TOKEN") 
GHL_LOCATION_ID = os.getenv("GHL_LOCATION_ID") 
GHL_VERSION = os.getenv("GHL_VERSION", "2021-04-15")


def send_ghl_payment_update(contact_id, appointment_id, amount, access_token=None):
    """
    Envía una etiqueta de confirmación de pago a un contacto en GoHighLevel (GHL).
    """
    token_to_use = access_token or GHL_TOKEN
    if not token_to_use:
        print("❌ Clave API de GHL (GHL_TOKEN) no configurada.")
        return False
        
    # --- 1. Define la Etiqueta (Tag) a Aplicar ---
    TAG_TO_APPLY = "Pago Aprobado MP" 

    # --- 2. Endpoint y Encabezados de la API de GHL ---
    url = f"https://services.leadconnectorhq.com/contacts/{contact_id}"
    headers = {
        "Authorization": f"Bearer {token_to_use}",
        "Content-Type": "application/json",
        "Version": GHL_VERSION 
    }

    # --- 3. Cuerpo (Payload) para Añadir la Etiqueta ---
    payload = {
        "tags": [TAG_TO_APPLY] 
    }

    print(f"📡 Enviando Tag '{TAG_TO_APPLY}' a Contacto GHL: {contact_id}...")
    try:
        response = requests.put(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status() 
        
        # Opcional: El PUT /contacts devuelve un 200 OK si todo fue bien
        print(f"✅ Estado de Respuesta GHL: {response.status_code}")
        print(f"✅ Contacto {contact_id} de GHL etiquetado con éxito.")
        return True # <-- Importante: devuelve True en caso de éxito
    
    except requests.exceptions.HTTPError as e:
        print(f"❌ Error HTTP de GHL: {e}")
        print(f"Cuerpo de la Respuesta de GHL: {response.text}") 
        return False # <-- Importante: devuelve False en caso de error HTTP
    except Exception as e:
        print(f"❌ Error general de GHL: {e}")
        return False # <-- Importante: devuelve False en caso de error general