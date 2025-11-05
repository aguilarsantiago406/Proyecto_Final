from django.shortcuts import render
from django.http import JsonResponse


def index(request):
    # Placeholder JSON; en el futuro renderizará template HTML
    return JsonResponse({
        "app": "dashboard",
        "status": "ok",
        "features": ["resumen clientes", "pagos", "aprobados", "pendientes"]
    })