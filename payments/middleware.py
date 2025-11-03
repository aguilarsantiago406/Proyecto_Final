import json
from datetime import datetime
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

class RequestLogMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        try:
            # Ignorar rutas del frontend o de APIs que se consultan constantemente
            excluded_paths = ["/payments/", "/payments/logs/"]

            # Si la ruta actual está excluida, no guardar log
            if request.path in excluded_paths:
                return response

            # Guardar log solo para eventos importantes
            AuditLog.objects.create(
                event="HTTP_REQUEST",
                user_id=str(getattr(request.user, "id", None)),
                details={
                    "path": request.path,
                    "method": request.method,
                    "status_code": response.status_code,
                }
            )
        except Exception:
            pass

        return response
