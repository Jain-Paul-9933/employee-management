from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.forms.views import FormTemplateViewSet, FormFieldViewSet

router = DefaultRouter()
router.register(r"form-templates", FormTemplateViewSet, basename="form-template")
router.register(r"form-fields", FormFieldViewSet, basename="form-field")

urlpatterns = [
    path("", include(router.urls)),
]
