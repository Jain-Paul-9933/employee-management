from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Employee
from .serializers import (
    EmployeeSerializer,
    EmployeeCreateSerializer,
    EmployeeListSerializer,
    EmployeeUpdateSerializer
)
from apps.forms.models import FormTemplate


class EmployeeViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['data', 'form_template__name']
    filterset_fields = ['form_template', 'is_active']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):

        return Employee.objects.filter(
            created_by=self.request.user
        ).select_related('form_template', 'form_template__created_by').prefetch_related('form_template__fields')

    def get_serializer_class(self):

        if self.action == 'create':
            return EmployeeCreateSerializer
        elif self.action == 'list':
            return EmployeeListSerializer
        elif self.action in ['update', 'partial_update']:
            return EmployeeUpdateSerializer
        return EmployeeSerializer

    def perform_create(self, serializer):

        serializer.save(created_by=self.request.user)

    def get_serializer_context(self):
        
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def by_template(self, request):
        
        template_id = request.query_params.get('template_id')
        if not template_id:
            return Response(
                {'error': 'template_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            template = FormTemplate.objects.get(
                id=template_id, 
                created_by=request.user
            )
        except FormTemplate.DoesNotExist:
            return Response(
                {'error': 'Form template not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        employees = self.get_queryset().filter(form_template=template)
        serializer = self.get_serializer(employees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        
        query = request.query_params.get('q', '')
        template_id = request.query_params.get('template_id')
        
        queryset = self.get_queryset()
        
        if template_id:
            queryset = queryset.filter(form_template_id=template_id)
        
        if query:
            queryset = queryset.filter(
                Q(form_template__name__icontains=query) |
                Q(data__icontains=query)
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def validate_data(self, request, pk=None):
        
        employee = self.get_object()
        validation_errors = employee.validate_data_against_template()
        
        if validation_errors:
            return Response({
                'valid': False,
                'errors': validation_errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'valid': True,
            'message': 'Employee data is valid'
        })

    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        
        employee_ids = request.data.get('employee_ids', [])
        if not employee_ids:
            return Response(
                {'error': 'employee_ids is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        employees = self.get_queryset().filter(id__in=employee_ids)
        deleted_count = employees.count()
        employees.delete()
        
        return Response({
            'message': f'Successfully deleted {deleted_count} employees',
            'deleted_count': deleted_count
        })

    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())
        
        search_query = request.query_params.get('search')
        
        if search_query:
            queryset = queryset.filter(
                Q(form_template__name__icontains=search_query) |
                Q(data__icontains=search_query)
            )
        
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
