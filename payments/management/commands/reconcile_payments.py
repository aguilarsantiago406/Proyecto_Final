from django.core.management.base import BaseCommand
from payments.models import Payment
import requests
import os
import json

class Command(BaseCommand):
    help = "Reconciliación automática entre Mercado Pago y registros locales"

    def handle(self, *args, **options):
        mp_token = os.getenv("MP_ACCESS_TOKEN")
        if not mp_token:
            self.stdout.write(self.style.ERROR("MP_ACCESS_TOKEN no configurado"))
            return

        url = "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc"
        headers = {"Authorization": f"Bearer {mp_token}"}
        resp = requests.get(url, headers=headers)
        data = resp.json()

        if "results" not in data:
            self.stdout.write(self.style.ERROR("Respuesta inválida de Mercado Pago"))
            return

        discrepancies = []
        for item in data["results"]:
            payment_id = str(item["id"])
            status = item.get("status")
            external_ref = item.get("external_reference")

            local = Payment.objects.filter(payment_id=payment_id).first()
            if not local:
                discrepancies.append({
                    "type": "missing_local",
                    "payment_id": payment_id,
                    "status": status,
                    "external_reference": external_ref
                })
            elif local.status != status:
                discrepancies.append({
                    "type": "status_mismatch",
                    "payment_id": payment_id,
                    "local_status": local.status,
                    "mp_status": status
                })
                local.status = status
                local.save()

        # Crear carpeta si no existe
        os.makedirs("logs/reconcile", exist_ok=True)
        with open("logs/reconcile/report.json", "w", encoding="utf-8") as f:
            json.dump(discrepancies, f, indent=2, ensure_ascii=False)

        self.stdout.write(self.style.SUCCESS(
            f"Reconciliación completada. {len(discrepancies)} diferencias encontradas."
        ))
