# payments/webhooks.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
import requests

from .models import Payment, ClientIntegration
# ✅ IMPORTACIÓN CORRECTA: Asume que el archivo está en payments/services/
from .services.ghl_service import send_ghl_payment_update 

MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")

@csrf_exempt
def mp_webhook(request):
    try:
        body_json = None
        if request.body:
            try:
                body_json = json.loads(request.body.decode("utf-8"))
            except Exception:
                body_json = None

        print("📦 Webhook recibido:", body_json or dict(request.GET))

        # 🔍 Filtro CRÍTICO: solo procesar eventos de tipo 'payment' (ignora merchant_order)
        
        event_type = None
        if isinstance(body_json, dict):
            event_type = body_json.get("type") # Lee 'type' del body JSON
        
        if not event_type:
            event_type = request.GET.get("topic") # Lee 'topic' de la URL (Query Params)

        if event_type and event_type != "payment":
            #print(f"⚠️ Ignorando evento de tipo {event_type} (no es 'payment').")
            return JsonResponse({"status": "ignored", "note": f"type {event_type} not handled"}, status=200)
        

        payment_id = None

        # 1. Obtener el ID del JSON body
        if body_json and isinstance(body_json, dict):
            payment_id = body_json.get("data", {}).get("id") or body_json.get("id")

        # 2. Obtener el ID de Query Params (fallback)
        if not payment_id:
            q = request.GET
            payment_id = q.get("data.id") or q.get("id") or q.get("payment_id")

        if not payment_id:
            print("⚠️ Webhook sin payment_id. Ignorando.")
            return JsonResponse({"status": "received", "note": "no payment_id found"}, status=200)

        print("💳 ID del pago recibido:", payment_id)

        # No hay Idempotencia local AQUÍ para permitir consultar a MP en cada webhook

        if not MP_ACCESS_TOKEN:
            print("❌ MP_ACCESS_TOKEN no configurado en el entorno.")
            return JsonResponse({"error": "MP_ACCESS_TOKEN not set"}, status=500)

        # 🔗 Consultar pago en Mercado Pago
        url = f"https://api.mercadopago.com/v1/payments/{payment_id}"
        headers = {"Authorization": f"Bearer {MP_ACCESS_TOKEN}"}
        resp = requests.get(url, headers=headers, timeout=10)

        if resp.status_code == 404:
            print("❌ Payment not found en Mercado Pago. Resp:", resp.json())
            return JsonResponse({"status": "payment_not_found", "mp_response": resp.json()}, status=200)

        if resp.status_code != 200:
            print("❌ Error consultando MP:", resp.status_code, resp.text)
            return JsonResponse({"status": "mp_error", "code": resp.status_code, "body": resp.text}, status=400)

        payment_info = resp.json()
        print("📘 Respuesta de Mercado Pago:", json.dumps(payment_info, indent=2))

        # 🧾 Extraer datos del pago
        mp_status = payment_info.get("status")
        transaction_amount = payment_info.get("transaction_amount")
        external_reference = payment_info.get("external_reference")
        # Identificador del comercio (cliente) en MP
        collector_id = payment_info.get("collector_id")
        client_for_ghl = None
        if collector_id:
            client_for_ghl = ClientIntegration.objects.filter(mp_user_id=str(collector_id)).first()
            if client_for_ghl:
                print(f"🧩 Cliente identificado por mp_user_id={collector_id} → GHL location={client_for_ghl.ghl_location_id}")
            else:
                print(f"⚠️ No se encontró ClientIntegration con mp_user_id={collector_id}. Se usará token GHL global si existe.")

        # 🧠 Buscar registro de pago en DB
        payment_obj = None
        appointment_id_clean = None

        if external_reference and external_reference.startswith("appointment_"):
            appointment_id_clean = external_reference.replace("appointment_", "")
            payment_obj = Payment.objects.filter(appointment_id=appointment_id_clean).first()
        
        # Fallback si no se encontró por external_reference (no recomendado en producción)
        #if not payment_obj:
            # Si se maneja el caso de crear el pago en otro lugar, este fallback puede ser peligroso.
            # Por ahora lo dejamos simple para el MVP.
            #payment_obj = Payment.objects.filter(status="pending").order_by("-created_at").first()

        if payment_obj:
            
            # 🚨 Idempotencia Reforzada: Si ya está aprobado Y GHL notificado, salimos.
            if payment_obj.status == "approved" and payment_obj.ghl_notified:
                print("✅ Pago ya APPROVED y GHL notificado. Idempotencia aplicada.")
                return JsonResponse({"status": "already_processed", "payment_id": payment_id}, status=200)

            # Actualizar campos (status, payment_id, amount)
            if mp_status and mp_status != payment_obj.status:
                payment_obj.status = mp_status
                
            payment_obj.payment_id = str(payment_id)
            if transaction_amount:
                 try:
                     payment_obj.amount = float(transaction_amount)
                 except Exception:
                     pass
                     
            payment_obj.save()
            print(f"✅ Pago actualizado localmente: {payment_obj.id} (payment_id={payment_obj.payment_id}, status={payment_obj.status}, GHL Notified: {payment_obj.ghl_notified})")

            # 🚨 LÓGICA DE GOHIGHLEVEL Y REINTENTO (LA PARTE CLAVE)
            if payment_obj.status == "approved" and not payment_obj.ghl_notified:
                
                print(f"🚀 Intentando enviar confirmación de pago APROBADO a GHL para Contacto: {payment_obj.contact_id}")
                
                # Ejecutamos la función. Esta debe devolver True o False.
                ghl_access_token = client_for_ghl.ghl_access_token if client_for_ghl and client_for_ghl.ghl_access_token else None
                ghl_success = send_ghl_payment_update(
                    contact_id=payment_obj.contact_id, 
                    appointment_id=payment_obj.appointment_id,
                    amount=payment_obj.amount,
                    access_token=ghl_access_token
                )
                
                if ghl_success:
                    # Si fue exitoso (retorna True), marcamos el flag de notificación.
                    payment_obj.ghl_notified = True
                    payment_obj.save()
                    print("🎉 Notificación GHL enviada con ÉXITO. Flag actualizado.")
                else:
                    # Si falló (ej. 403 o error de red), el flag sigue en False. 
                    # El próximo webhook lo intentará de nuevo.
                    print("⚠️ Fallo en notificación GHL. Permitiendo reintento en próximo webhook.")
            
            elif payment_obj.status != "approved":
                 print(f"🕐 Estado {mp_status} no es 'approved'. Esperando confirmación final.")
        
        # Caso: Pago recibido sin un registro local previo asociado
        else:
             print("⚠️ No se encontró registro local de PAGO asociado, creando nuevo registro (sin contact_id).")
             new = Payment.objects.create(
                 appointment_id=appointment_id_clean or f"pref_{payment_id}",
                 contact_id="", 
                 preference_id=external_reference or "",
                 payment_id=str(payment_id),
                 amount=transaction_amount or 0,
                 status=mp_status or "unknown",
             )
             print(f"🆕 Pago creado localmente: id={new.id}, payment_id={new.payment_id}, status={new.status}")


        return JsonResponse({"status": "processed", "payment_id": payment_id}, status=200)

    except Exception as e:
        print("❌ Error grave en webhook:", e)
        return JsonResponse({"error": str(e)}, status=500)
    
    
    
    
    
@csrf_exempt
def ghl_callback(request):
    # 1 Obtener el parámetro "code" que GHL envía
    code = request.GET.get("code")

    if not code:
        return JsonResponse({"error": "Missing code"}, status=400)

    # 2 Hacer POST a GHL para intercambiar el code por tokens
    response = requests.post("https://api.msgsndr.com/oauth/token", data={
        "grant_type": "authorization_code",
        "client_id": os.getenv("GHL_CLIENT_ID"),
        "client_secret": os.getenv("GHL_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GHL_REDIRECT_URI"),
        "code": code
    })

    data = response.json()

    # 3 Mostrar respuesta para pruebas (después lo guardarás en BD)
    print("Respuesta de GHL:", data)

    # 4 Guardar tokens por cliente (ubicación)
    location_id = data.get("location_id") or data.get("locationId") or ""
    access_token = data.get("access_token") or ""
    refresh_token = data.get("refresh_token") or ""

    if access_token:
        obj, _created = ClientIntegration.objects.get_or_create(
            ghl_location_id=location_id,
            defaults={"name": f"GHL {location_id}"}
        )
        obj.ghl_access_token = access_token
        obj.ghl_refresh_token = refresh_token
        obj.save()

    return JsonResponse({
        "saved": bool(access_token),
        "location_id": location_id,
        "access_token": bool(access_token),
        "refresh_token": bool(refresh_token)
    })


@csrf_exempt
def mp_callback(request):
    # 1 Obtener el parámetro "code" que Mercado Pago envía
    code = request.GET.get("code")
    if not code:
        return JsonResponse({"error": "Missing code"}, status=400)

    # 2 Intercambiar code por tokens en Mercado Pago
    response = requests.post("https://api.mercadopago.com/oauth/token", data={
        "grant_type": "authorization_code",
        "client_id": os.getenv("MP_CLIENT_ID"),
        "client_secret": os.getenv("MP_CLIENT_SECRET"),
        "code": code,
        "redirect_uri": os.getenv("MP_REDIRECT_URI"),
    })

    data = response.json()
    print("Respuesta de MP OAuth:", data)

    # 3 Guardar tokens por cliente (user_id)
    user_id = str(data.get("user_id") or "")
    access_token = data.get("access_token") or ""
    refresh_token = data.get("refresh_token") or ""

    if access_token and user_id:
        obj, _created = ClientIntegration.objects.get_or_create(
            mp_user_id=user_id,
            defaults={"name": f"MP {user_id}"}
        )
        obj.mp_access_token = access_token
        obj.mp_refresh_token = refresh_token
        obj.save()

    return JsonResponse({
        "saved": bool(access_token and user_id),
        "user_id": user_id,
        "access_token": bool(access_token),
        "refresh_token": bool(refresh_token)
    })