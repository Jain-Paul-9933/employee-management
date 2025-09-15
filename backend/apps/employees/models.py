from django.db import models
from apps.forms.models import FormTemplate
from apps.authentication.models import CustomUser


class Employee(models.Model):
    form_template = models.ForeignKey(
        FormTemplate, 
        on_delete=models.CASCADE, 
        related_name="employees",
    )
    data = models.JSONField(
        default=dict,
    )
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="created_employees"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    def __str__(self):
        template = self.form_template
        if template:                                        
            name_fields = ["name", "full_name", "first_name", "employee_name"]
            for field in template.fields.all():
                if any(nf in field.label.lower() for nf in name_fields):
                    value = self.data.get(field.id, "")
                    if value:
                        return str(value)
        return f"Employee #{self.id}"

    @property
    def display_name(self):
        return str(self)

    def get_field_value(self, field_id):
        return self.data.get(field_id)

    def set_field_value(self, field_id, value):
        self.data[field_id] = value

    def validate_data_against_template(self):
        template = self.form_template
        errors = []
        
        for field in template.fields.all():
            value = self.data.get(field.id)
            
            if field.is_required and (not value or str(value).strip() == ""):
                errors.append(f"{field.label} is required")
                continue
            
            if not value or str(value).strip() == "":
                continue
                
            if field.field_type == "EMAIL":
                import re
                if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', str(value)):
                    errors.append(f"{field.label} must be a valid email")
            
            elif field.field_type == "NUMBER":
                try:
                    float(value)
                except (ValueError, TypeError):
                    errors.append(f"{field.label} must be a valid number")
            
            elif field.field_type == "DATE":
                try:
                    from datetime import datetime
                    datetime.strptime(str(value), '%Y-%m-%d')
                except ValueError:
                    errors.append(f"{field.label} must be a valid date (YYYY-MM-DD)")
            
            elif field.field_type == "SELECT":
                if field.options and value not in field.options:
                    errors.append(f"{field.label} must be one of: {', '.join(field.options)}")
        
        return errors
