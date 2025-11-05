# auth_app/views.py
"""
Endpoints de autenticación y OAuth para GHL y Mercado Pago.

Endpoints:
- POST /auth/register/     -> registra usuario (username, password, email)
- POST /auth/login/        -> retorna JWT (token)
- GET  /auth/me/           -> info del usuario (necesita Authorization: Bearer <token>)
- GET  /auth/ghl/install/  -> devuelve link de instalación GHL (client_id desde .env)
- GET  /auth/callback/ -> callback GHL que recibe 'code' y crea Client
- GET  /auth/mp/callback/  -> callback MP que recibe 'code' y guarda tokens en Client
"""

import os
import json
import requests
import jwt
import datetime

from .models import User, Client
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt


# Lee SECRET de Django (asegúrate que tu settings carga .env)
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") or "unsafe-secret-for-dev"

JWT_ALGO = "HS256"
JWT_EXP_HOURS = 8


def _create_jwt(user):
    payload = {
        "sub": user.username,
        "user_id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXP_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGO)
    return token


def _decode_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGO])
        return payload
    except Exception as e:
        print("❌ JWT decode error:", e)
        return None


@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = json.loads(request.body.decode())
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if not username or not password:
            return JsonResponse({"error": "username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "username exists"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        print(f"✅ Usuario registrado: {username}")

        token = _create_jwt(user)
        return JsonResponse({"message": "registered", "token": token})
    except Exception as e:
        print("❌ Error register:", e)
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = json.loads(request.body.decode())
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            print(f"⚠️ Login failed for {username}")
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        token = _create_jwt(user)
        print(f"✅ Login success for {username}")
        return JsonResponse({"token": token})
    except Exception as e:
        print("❌ Error login:", e)
        return JsonResponse({"error": str(e)}, status=500)


def me(request):
    auth = request.META.get("HTTP_AUTHORIZATION", "")
    if not auth.startswith("Bearer "):
        return JsonResponse({"error": "Authorization header missing"}, status=401)
    token = auth.split(" ")[1]
    payload = _decode_jwt(token)
    if not payload:
        return JsonResponse({"error": "Invalid token"}, status=401)
    try:
        user = User.objects.get(id=payload.get("user_id"))
        return JsonResponse({"username": user.username, "email": user.email, "id": user.id})
    except Exception as e:
        print("❌ Error fetching user in /me:", e)
        return JsonResponse({"error": "User not found"}, status=404)
    
    

def ghl_install_link(request):
    """
    Devuelve la URL para instalar la app privada en GHL.
    Genera link compatible con la versión actual de Marketplace.
    """
    try:
        # Variables desde settings.py / .env
        client_id = os.getenv("GHL_CLIENT_ID")
        redirect_uri = os.getenv("GHL_REDIRECT_URI")
        version_id = os.getenv("GHL_VERSION")
        scopes = "contacts.readonly contacts.write locations/tags.readonly locations/tags.write"

        # Logs para depuración
        print("📌 GHL_CLIENT_ID:", client_id)
        print("📌 GHL_REDIRECT_URI:", redirect_uri)
        print("📌 GHL_VERSION:", version_id)

        # Validación de configuración
        if not client_id or not redirect_uri or not version_id:
            print("❌ Error: Falta alguna variable GHL_* en .env o settings.")
            return JsonResponse({"error": "GHL not configured properly"}, status=500)

        # Construir la URL correctamente con '?'
        install_url = (
            "https://marketplace.gohighlevel.com/oauth/chooselocation"
            f"?response_type=code"
            f"&client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            f"&scope={scopes.replace(' ', '+')}"  # usar '+' en lugar de espacios
            f"&version_id={version_id}"
        )

        # Log de éxito
        print("✅ GHL install link generado correctamente:")
        print(install_url)

        return JsonResponse({"install_url": install_url}, status=200)

    except Exception as e:
        print("❌ Error inesperado generando GHL install link:", e)
        return JsonResponse({"error": str(e)}, status=500)




def ghl_callback(request):
    """
    Callback GHL: intercambia code por tokens y crea un Client.
    GHL redirige aquí tras autorizar la app privada.
    """
    print("🔔 GHL callback recibido")
    code = request.GET.get("code")
    if not code:
        print("❌ No se recibió 'code' en callback")
        return JsonResponse({"error": "Missing code"}, status=400)
    try:
        token_url = "https://api.msgsndr.com/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": os.getenv("GHL_CLIENT_ID"),
            "client_secret": os.getenv("GHL_CLIENT_SECRET"),
            "redirect_uri": os.getenv("GHL_REDIRECT_URI"),
        }
        r = requests.post(token_url, data=payload, timeout=15)
        print(f"📤 Solicitud a GHL enviada, status {r.status_code}")

        data = r.json()
        print("🔑 GHL token response:", data)

        location_id = data.get("locationId") or data.get("location_id") or data.get("location")
        access_token = data.get("access_token")
        refresh_token = data.get("refresh_token")

        client = Client.objects.create(
            name=f"GHL_{location_id or 'unknown'}",
            ghl_location_id=location_id,
            ghl_access_token=access_token,
            ghl_refresh_token=refresh_token
        )
        print(f"✅ Client creado desde GHL: id={client.id}")
        return JsonResponse({"ok": True, "client_id": client.id, "ghl": data})
    except Exception as e:
        print("❌ Error GHL callback:", e)
        return JsonResponse({"error": str(e)}, status=500)


def mp_callback(request):
    """
    Callback Mercado Pago OAuth (si usas OAuth para MP).
    Guarda access token mp en último Client creado.
    """
    print("🔔 MP callback recibido")
    code = request.GET.get("code")
    if not code:
        print("❌ No se recibió 'code' en MP callback")
        return JsonResponse({"error": "Missing code"}, status=400)
    try:
        token_url = "https://api.mercadopago.com/oauth/token"
        payload = {
            "grant_type": "authorization_code",
            "client_id": os.getenv("MP_CLIENT_ID"),
            "client_secret": os.getenv("MP_CLIENT_SECRET"),
            "code": code,
            "redirect_uri": os.getenv("MP_REDIRECT_URI"),
        }
        r = requests.post(token_url, data=payload, timeout=15)
        print(f"📤 Solicitud a MP enviada, status {r.status_code}")

        data = r.json()
        print("🔑 MP token response:", data)

        mp_user_id = data.get("user_id")
        access_token = data.get("access_token")
        refresh_token = data.get("refresh_token")

        client = Client.objects.filter(mp_user_id__isnull=True).last() or Client.objects.last()
        if not client:
            client = Client.objects.create(name="MP_client_auto")
            print("⚠️ No existía Client previo, se creó uno nuevo")

        client.mp_user_id = mp_user_id
        client.mp_access_token = access_token
        client.mp_refresh_token = refresh_token
        client.save()
        print(f"✅ Client actualizado con MP: id={client.id}, mp_user_id={mp_user_id}")
        return JsonResponse({"ok": True, "client_id": client.id, "mp": {"user_id": mp_user_id}})
    except Exception as e:
        print("❌ Error MP callback:", e)
        return JsonResponse({"error": str(e)}, status=500)
