from django.db import models
from apps.authentication.models import CustomUser
from django.core.exceptions import ValidationError


# Create your models here.
class FormTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="form_templates"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Form Template"
        verbose_name_plural = "Form Templates"

    def __str__(self):
        return self.name

    @property
    def field_count(self):
        return self.fields.count()

    @property
    def required_field_count(self):
        return self.fields.filter(is_required=True).count()


class FormField(models.Model):
    FIELD_TYPES_CHOICES = [
        ("TEXT", "Text"),
        ("NUMBER", "Number"),
        ("DATE", "Date"),
        ("EMAIL", "Email"),
        ("SELECT", "Select"),
        ("PASSWORD", "Password"),
        ("TEXTAREA", "Textarea"),
    ]
    form_template = models.ForeignKey(
        FormTemplate, on_delete=models.CASCADE, related_name="fields"
    )
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES_CHOICES)
    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, blank=True, null=True)
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    options = models.JSONField(default=list, blank=True)  # For SELECT type fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order"]
        unique_together = ("form_template", "label")
        verbose_name = "Form Field"
        verbose_name_plural = "Form Fields"

    def __str__(self):
        return f"{self.form_template.name} - {self.label}"
    
    def clean(self):
        if self.field_type == "SELECT":
            if not self.options or len(self.options) == 0:
                raise ValidationError({"options": "SELECT fields must have at least one option."})
            
        if self.field_type not in dict(self.FIELD_TYPES_CHOICES):
            raise ValidationError({"field_type": "Invalid field type."})
    
    def save(self, *args, **kwargs):
        self.full_clean()  # This will call the clean method
        super().save(*args, **kwargs)