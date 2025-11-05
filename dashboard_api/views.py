# dashboard_api/views.py
"""
Endpoints para dashboard y reportes:
- GET /dashboard/summary/   -> estadísticas globales (total, approved, pending)
- GET /dashboard/payments/  -> pagos filtrados (opcional: ?client_id=)
- GET /dashboard/export/    -> exporta un reporte JSON/CSV (simple)
"""

import json
import os
from django.http import JsonResponse, HttpResponse
from payments.models import Payment, AuditLog
from auth_app.models import Client

def summary(request):
    try:
        total = Payment.objects.count()
        approved = Payment.objects.filter(status__iexact="approved").count()
        pending = Payment.objects.filter(status__iexact="pending").count()
        last_update = Payment.objects.order_by("-updated_at").first()
        last = last_update.updated_at.strftime("%Y-%m-%d %H:%M:%S") if last_update else None

        print("📊 Dashboard summary requested")
        return JsonResponse({
            "total_payments": total,
            "approved": approved,
            "pending": pending,
            "last_update": last
        })
    except Exception as e:
        print("❌ Error dashboard summary:", e)
        return JsonResponse({"error": str(e)}, status=500)


def payments_list(request):
    try:
        client_id = request.GET.get("client_id")
        qs = Payment.objects.all()
        if client_id:
            # si asocias Payment.client en el modelo, filtrar por client: Payment.objects.filter(client__id=client_id)
            qs = qs.filter(preference_id__icontains=f"appointment_")  # simple filter fallback
        data = [
            {
                "id": p.id,
                "appointment_id": p.appointment_id,
                "contact_id": p.contact_id,
                "amount": float(p.amount),
                "status": p.status,
                "created_at": p.created_at.strftime("%Y-%m-%d %H:%M:%S")
            } for p in qs.order_by("-created_at")[:200]
        ]
        print("📄 Dashboard payments list requested, count:", len(data))
        return JsonResponse(data, safe=False)
    except Exception as e:
        print("❌ Error payments_list:", e)
        return JsonResponse({"error": str(e)}, status=500)


def export_report(request):
    """
    Exporta reporte sencillo en JSON (podrías añadir CSV)
    """
    try:
        payments = list(Payment.objects.all().values("id", "appointment_id", "contact_id", "amount", "status", "created_at"))
        # serializar datetimes
        for p in payments:
            p["created_at"] = p["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        report = {"generated_at": __import__("datetime").datetime.utcnow().isoformat(), "payments": payments}
        print("📦 Export report generated")
        return JsonResponse(report)
    except Exception as e:
        print("❌ Error export_report:", e)
        return JsonResponse({"error": str(e)}, status=500)
