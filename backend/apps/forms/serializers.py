from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .models import FormField, FormTemplate


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Text Field Example",
            summary="Text input field",
            description="A simple text input field",
            value={
                "id": 1,
                "field_type": "TEXT",
                "label": "Full Name",
                "placeholder": "Enter your full name",
                "is_required": True,
                "order": 0,
                "options": [],
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        ),
        OpenApiExample(
            "Select Field Example",
            summary="Select dropdown field",
            description="A select dropdown field with options",
            value={
                "id": 2,
                "field_type": "SELECT",
                "label": "Department",
                "placeholder": "Select department",
                "is_required": True,
                "order": 1,
                "options": ["IT", "HR", "Finance", "Marketing"],
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        )
    ]
)
class FormFieldSerializer(serializers.ModelSerializer):
    """
    Serializer for form fields within a form template.
    
    This serializer handles individual form fields that make up a form template.
    It supports various field types including TEXT, EMAIL, NUMBER, DATE, PASSWORD,
    and SELECT fields. For SELECT fields, options are required and validated.
    """
    class Meta:
        model = FormField
        fields = [
            "id",
            "field_type",
            "label",
            "placeholder",
            "is_required",
            "order",
            "options",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        field_type = attrs.get("field_type")
        options = attrs.get("options", [])

        if field_type == "SELECT":
            if not isinstance(options, list) or len(options) == 0:
                raise serializers.ValidationError(
                    {"options": "SELECT fields must have at least one option."}
                )

            cleaned = [
                opt.strip() for opt in options if isinstance(opt, str) and opt.strip()
            ]
            if not cleaned:
                raise serializers.ValidationError(
                    {"options": "Options cannot be empty or whitespace."}
                )

            attrs["options"] = cleaned

        return attrs


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Form Template Example",
            summary="Complete form template",
            description="A complete form template with fields and metadata",
            value={
                "id": 1,
                "name": "Employee Registration Form",
                "description": "Comprehensive form for new employee registration",
                "created_by": "admin",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "is_active": True,
                "fields": [
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
                "field_count": 2,
                "required_field_count": 2
            }
        )
    ]
)
class FormTemplateSerializer(serializers.ModelSerializer):
    """
    Complete form template serializer with all fields and relationships.
    
    This serializer provides comprehensive form template data including all
    associated form fields, field counts, and metadata. Used for detailed
    template retrieval and updates.
    """
    fields = FormFieldSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    field_count = serializers.ReadOnlyField()
    required_field_count = serializers.ReadOnlyField()

    class Meta:
        model = FormTemplate
        fields = [
            "id",
            "name",
            "description",
            "created_by",
            "created_at",
            "updated_at",
            "is_active",
            "fields",
            "field_count",
            "required_field_count",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "created_by"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty or whitespace.")

        queryset = FormTemplate.objects.filter(
            name__iexact=value.strip(), created_by=self.context["request"].user
        )

        if self.instance:
            queryset = queryset.exclude(id=self.instance.id)

        if queryset.exists():
            raise serializers.ValidationError(
                "A form template with this name already exists."
            )

        return value.strip()


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Create Form Template Example",
            summary="Create new form template",
            description="Example data for creating a new form template with fields",
            value={
                "name": "New Employee Form",
                "description": "Form for collecting new employee information",
                "fields": [
                    {
                        "field_type": "TEXT",
                        "label": "Full Name",
                        "placeholder": "Enter full name",
                        "is_required": True,
                        "order": 0,
                        "options": []
                    },
                    {
                        "field_type": "EMAIL",
                        "label": "Email Address",
                        "placeholder": "Enter email address",
                        "is_required": True,
                        "order": 1,
                        "options": []
                    },
                    {
                        "field_type": "SELECT",
                        "label": "Department",
                        "placeholder": "Select department",
                        "is_required": True,
                        "order": 2,
                        "options": ["IT", "HR", "Finance", "Marketing"]
                    }
                ]
            }
        )
    ]
)
class FormTemplateCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new form templates with fields.
    
    This serializer is used when creating new form templates along with their
    associated form fields. It validates both the template data and all field
    data, ensuring proper field types and required options for SELECT fields.
    """
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = FormTemplate
        fields = [
            "id",
            "name",
            "description",
            "fields",
        ]
        read_only_fields = ["id"]

    def validate_fields(self, value):
        if not value:
            raise serializers.ValidationError("At least one field is required.")

        for i, field_data in enumerate(value):
            field_serializer = FormFieldSerializer(data=field_data)
            if not field_serializer.is_valid():
                raise serializers.ValidationError(
                    {f"Field {i+1}": field_serializer.errors}
                )
        return value

    def create(self, validated_data):
        fields_data = validated_data.pop("fields")
        validated_data["created_by"] = self.context["request"].user
        form_template = FormTemplate.objects.create(**validated_data)

        for i, field_data in enumerate(fields_data):
            field_data["order"] = i
            FormField.objects.create(form_template=form_template, **field_data)

        return form_template
