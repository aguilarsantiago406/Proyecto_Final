from functools import wraps
from django.http import JsonResponse


def require_client_context(view_func):
    """Decorator multi-tenant placeholder: valida contexto de cliente."""

    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        # Placeholder: implementar resolución de cliente desde headers/query
        client_id = request.GET.get("client_id")
        if not client_id:
            return JsonResponse({"error": "missing client_id"}, status=400)
        request.client_id = client_id
        return view_func(request, *args, **kwargs)

    return _wrapped