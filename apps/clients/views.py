from django.http import JsonResponse


def index(request):
    return JsonResponse({"app": "clients", "status": "ok"})


def oauth_info(request):
    return JsonResponse({
        "ghl_callback": "/clients/oauth/callback/ghl/",
        "mp_callback": "/clients/oauth/callback/mp/",
    })