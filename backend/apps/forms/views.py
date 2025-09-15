from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import FormTemplate, FormField
from .serializers import (
    FormTemplateSerializer,
    FormTemplateCreateSerializer,
    FormFieldSerializer,
)
from rest_framework.exceptions import PermissionDenied
from django.db import models


class FormTemplateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name", "description"]
    filterset_fields = ["is_active"]
    ordering_fields = ["created_at", "updated_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return FormTemplate.objects.filter(created_by=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return FormTemplateCreateSerializer
        return FormTemplateSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class FormFieldViewSet(viewsets.ModelViewSet):
    serializer_class = FormFieldSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FormField.objects.filter(
            form_template__created_by=self.request.user
        ).select_related("form_template")

    def perform_create(self, serializer):
        form_template = serializer.validated_data.get("form_template")
        if form_template.created_by != self.request.user:
            raise PermissionDenied(
                "You do not have permission to add fields to this form template."
            )

        if "order" not in serializer.validated_data:
            last_order = FormField.objects.filter(
                form_template=form_template
            ).aggregate(models.Max("order"))["order__max"] or 0
            serializer.save(order=last_order + 1)
        else:
            serializer.save()
