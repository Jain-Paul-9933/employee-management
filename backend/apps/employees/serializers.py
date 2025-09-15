from rest_framework import serializers
from .models import Employee
from apps.forms.models import FormTemplate, FormField
from apps.forms.serializers import FormFieldSerializer


class EmployeeSerializer(serializers.ModelSerializer):

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


class EmployeeCreateSerializer(serializers.ModelSerializer):

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


class EmployeeListSerializer(serializers.ModelSerializer):

    form_template_name = serializers.CharField(source='form_template.name', read_only=True)
    display_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'form_template', 'form_template_name', 'data', 
            'display_name', 'created_at', 'updated_at', 'is_active'
        ]


class EmployeeUpdateSerializer(serializers.ModelSerializer):

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
