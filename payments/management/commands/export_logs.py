from django.core.management.base import BaseCommand
from payments.models import AuditLog
from datetime import date
import json
import os

class Command(BaseCommand):
    help = "Exporta los logs del día en formato JSON"

    def handle(self, *args, **options):
        today = date.today().strftime("%Y-%m-%d")
        logs = AuditLog.objects.filter(timestamp__date=today)
        data = [
            {
                "event": log.event,
                "user_id": log.user_id,
                "timestamp": log.timestamp.isoformat(),
                "details": log.details
            }
            for log in logs
        ]
        #crea el directorio si no existe
        os.makedirs("logs/exports", exist_ok=True)
        filename = f"logs/exports/logs_{today}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        self.stdout.write(self.style.SUCCESS(f" Logs exportados a {filename}"))
