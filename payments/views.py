from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import os

from .models import Payment
from .services.mercadopago_service import create_payment_preference
from .utils.audit import log_event   # 👈 Importa la función de auditoría

MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN")


@csrf_exempt
@require_POST
def create_payment(request):
    # Crea un link de pago en Mercado Pago 
    
    data = json.loads(request.body)

    appointment_id = data.get("appointmentId")
    contact_id = data.get("contactId")
    amount = data.get("amount")
    description = data.get("description")

    preference = create_payment_preference(
        appointment_id, contact_id, amount, description
    )

    # Guarda el pago localmente
    payment = Payment.objects.create(
        appointment_id=appointment_id,
        contact_id=contact_id,
        preference_id=preference["preference_id"],
        description=description,
        amount=amount,
        status="pending"
    )

    # 🧾 Registrar el evento de auditoría
    log_event(
        event="CREATE_PAYMENT",
        user_id=contact_id,
        details={
            "appointment_id": appointment_id,
            "amount": amount,
            "description": description,
            "preference_id": preference["preference_id"],
        }
    )

    return JsonResponse({
        "init_point": preference["init_point"],
        "preference_id": preference["preference_id"]
    })
###########################################
#para que frontend pueda listar los pagos
def list_payments(request):
    payments = Payment.objects.all().order_by('-id')[:4]
    data = [
        {
            "payment_id": p.id,  #  ID del pago
            "contact_id": p.contact_id,  #  Contacto
            "appointment_id": p.appointment_id,  #  Cita
            "description": p.description or "",  #  Descripción (puede estar vacía)
            "amount": p.amount,
            "status": p.status,
            "date": p.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for p in payments
    ]
    return JsonResponse(data, safe=False)

