from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='clients_index'),
    path('oauth/info/', views.oauth_info, name='clients_oauth_info'),
]