from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .models import Employee
from apps.forms.models import FormTemplate, FormField
from apps.forms.serializers import FormFieldSerializer


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Employee Example",
            summary="Complete employee record",
            description="A complete employee record with all fields and template information",
            value={
                "id": 1,
                "form_template": 1,
                "form_template_name": "Employee Registration Form",
                "data": {
                    "field_1": "John Doe",
                    "field_2": "john@example.com",
                    "field_3": "IT Department",
                    "field_4": "2024-01-15"
                },
                "display_name": "John Doe",
                "template_fields": [
                    {
                        "id": 1,
                        "field_type": "TEXT",
                        "label": "Full Name",
                        "placeholder": "Enter full name",
                        "is_required": True,
                        "order": 0,
                        "options": []
                    },
                    {
                        "id": 2,
                        "field_type": "EMAIL",
                        "label": "Email Address",
                        "placeholder": "Enter email",
                        "is_required": True,
                        "order": 1,
                        "options": []
                    }
                ],
                "created_by": 1,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "is_active": True
            }
        )
    ]
)
class EmployeeSerializer(serializers.ModelSerializer):
    """
    Complete employee serializer with all fields and relationships.
    
    This serializer provides comprehensive employee data including the associated
    form template information and all form fields. Used for detailed employee
    retrieval and full updates.
    """
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)
    display_name = serializers.CharField(read_only=True)
    template_fields = FormFieldSerializer(source='form_template.fields', many=True, read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'form_template', 'form_template_name', 'data', 
            'display_name', 'template_fields', 'created_by', 
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Data must be a dictionary")
        return value

    def validate(self, attrs):
        form_template = attrs.get('form_template')
        data = attrs.get('data', {})
        
        if form_template:
            temp_employee = Employee(
                form_template=form_template,
                data=data
            )
            
            validation_errors = temp_employee.validate_data_against_template()
            if validation_errors:
                raise serializers.ValidationError({
                    'data': validation_errors
                })
        
        return attrs


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Create Employee Example",
            summary="Create new employee",
            description="Example data for creating a new employee record",
            value={
                "form_template": 1,
                "data": {
                    "field_1": "Jane Smith",
                    "field_2": "jane@example.com",
                    "field_3": "HR Department",
                    "field_4": "2024-02-01"
                }
            }
        )
    ]
)
class EmployeeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new employees.
    
    This serializer is used when creating new employee records. It validates
    the employee data against the selected form template requirements and
    ensures all required fields are provided.
    """
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)
    display_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'form_template', 'form_template_name', 'data', 
            'display_name', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Data must be a dictionary")
        return value

    def validate(self, attrs):
        form_template = attrs.get('form_template')
        data = attrs.get('data', {})
        
        if form_template:
            temp_employee = Employee(
                form_template=form_template,
                data=data
            )
            
            validation_errors = temp_employee.validate_data_against_template()
            if validation_errors:
                raise serializers.ValidationError({
                    'data': validation_errors
                })
        
        return attrs


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Employee List Example",
            summary="Employee list item",
            description="Example employee data for list views",
            value={
                "id": 1,
                "form_template": 1,
                "form_template_name": "Employee Registration Form",
                "data": {
                    "field_1": "John Doe",
                    "field_2": "john@example.com"
                },
                "display_name": "John Doe",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "is_active": True
            }
        )
    ]
)
class EmployeeListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for employee lists.
    
    This serializer is optimized for listing operations, providing essential
    employee information without the full template field details to improve
    performance when displaying multiple employees.
    """
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)
    display_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'form_template', 'form_template_name', 'data', 
            'display_name', 'created_at', 'updated_at', 'is_active'
        ]


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Update Employee Example",
            summary="Update employee data",
            description="Example data for updating an existing employee record",
            value={
                "data": {
                    "field_1": "John Doe Updated",
                    "field_2": "john.updated@example.com",
                    "field_3": "Senior IT Department"
                },
                "is_active": True
            }
        )
    ]
)
class EmployeeUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing employees.
    
    This serializer is used for partial updates of employee records. It allows
    updating the employee data while keeping the form template unchanged.
    The form_template field is read-only to prevent changing the template
    after employee creation.
    """
    form_template_name = serializers.CharField(source='form_template.name', read_only=True)
    display_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'form_template', 'form_template_name', 'data', 
            'display_name', 'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = ['id', 'form_template', 'created_at', 'updated_at']

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Data must be a dictionary")
        return value

    def validate(self, attrs):
        form_template = attrs.get('form_template') or self.instance.form_template
        data = attrs.get('data', {})
        
        if form_template:
            temp_employee = Employee(
                form_template=form_template,
                data=data
            )
            
            validation_errors = temp_employee.validate_data_against_template()
            if validation_errors:
                raise serializers.ValidationError({
                    'data': validation_errors
                })
        
        return attrs
