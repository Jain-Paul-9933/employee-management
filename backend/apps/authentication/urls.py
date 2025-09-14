from django.urls import path
from .views import logout

urlpatterns = [
    path("logout/", logout, name="logout"),
]
