from rest_framework import serializers
from .models import FormField, FormTemplate


class FormFieldSerializer(serializers.ModelSerializer):
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


class FormTemplateSerializer(serializers.ModelSerializer):
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


class FormTemplateCreateSerializer(serializers.ModelSerializer):
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
