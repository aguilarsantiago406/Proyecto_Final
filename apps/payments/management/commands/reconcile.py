from django.core.management.base import BaseCommand
from apps.payments.models import Payment, ClientIntegration
import requests
import json

class Command(BaseCommand):
    help = "Reconciliación diaria: compara pagos en MP vs registros locales y reporta diferencias por cliente"

    def handle(self, *args, **options):
        clients = ClientIntegration.objects.all()
        if not clients.exists():
            self.stdout.write(self.style.WARNING("No hay clientes con tokens almacenados"))
            return

        for c in clients:
            self.stdout.write(self.style.HTTP_INFO(f"Cliente: {c.name or c.id} | MP user_id={c.mp_user_id} | GHL location_id={c.ghl_location_id}"))

            if not c.mp_access_token:
                self.stdout.write(self.style.WARNING("  Sin MP access_token; saltando"))
                continue

            # 1) Buscar pagos recientes en MP
            url = "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc"
            headers = {"Authorization": f"Bearer {c.mp_access_token}"}
            try:
                resp = requests.get(url, headers=headers, timeout=10)
                mp_data = resp.json()
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Error consultando MP: {e}"))
                continue

            results = mp_data.get("results", [])
            self.stdout.write(f"  Pagos MP encontrados: {len(results)}")

            # 2) Comparar con Payments locales por external_reference
            differences = []
            for r in results[:50]:  # limitar para evitar respuestas enormes
                ext_ref = r.get("external_reference")
                status = r.get("status")
                amount = r.get("transaction_amount")
                pid = r.get("id")

                local = None
                if ext_ref and str(ext_ref).startswith("appointment_"):
                    appointment_id = str(ext_ref).replace("appointment_", "")
                    local = Payment.objects.filter(appointment_id=appointment_id).first()

                if not local:
                    differences.append({
                        "type": "missing_local",
                        "payment_id": pid,
                        "external_reference": ext_ref,
                        "status": status,
                        "amount": amount,
                    })
                else:
                    if str(local.payment_id) != str(pid) or str(local.status) != str(status):
                        differences.append({
                            "type": "status_mismatch",
                            "local_id": local.id,
                            "payment_id": pid,
                            "local_status": local.status,
                            "mp_status": status,
                        })

            # 3) Reportar
            if differences:
                self.stdout.write(self.style.WARNING(f"  Diferencias detectadas: {len(differences)}"))
                self.stdout.write(json.dumps(differences, indent=2, ensure_ascii=False))
            else:
                self.stdout.write(self.style.SUCCESS("  Sin diferencias"))

        self.stdout.write(self.style.SUCCESS("Reconciliación finalizada"))