# auth_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("me/", views.me, name="me"),
    # OAuth
    path("ghl/install/", views.ghl_install_link, name="ghl_install"),
    path("ghl/callback/", views.ghl_callback, name="ghl_callback"),
    path("mp/callback/", views.mp_callback, name="mp_callback"),
]
