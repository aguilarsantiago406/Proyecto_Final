# core/views.py
"""
Endpoints simples:
- GET /core/health/  -> status OK (useful for k8s / uptime)
- GET / -> small landing or info
"""

from django.http import JsonResponse, HttpResponse
import datetime
import os

def health(request):
    try:
        now = datetime.datetime.now().isoformat()
        print("❤️ Health check OK at", now)
        return JsonResponse({"status": "ok", "timestamp": now})
    except Exception as e:
        print("❌ Health error:", e)
        return JsonResponse({"status": "error", "error": str(e)}, status=500)


def index(request):
    return HttpResponse("GHL ↔ Mercado Pago Backend - Proyecto Final Integrador")
