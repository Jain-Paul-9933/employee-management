from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample

User = get_user_model()


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "User Registration Example",
            summary="Register new user",
            description="Example data for user registration",
            value={
                "username": "johndoe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "password": "securepassword123"
            }
        )
    ]
)
class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Custom user creation serializer.
    
    This serializer handles user registration with additional validation
    to ensure email uniqueness. It extends the Djoser UserCreateSerializer
    with custom field validation.
    """
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "User Profile Example",
            summary="User profile data",
            description="Example user profile information",
            value={
                "id": 1,
                "username": "johndoe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "date_joined": "2024-01-01T00:00:00Z",
                "is_active": True
            }
        )
    ]
)
class CustomUserSerializer(UserSerializer):
    """
    Custom user serializer for user profile data.
    
    This serializer provides user profile information excluding sensitive
    data like passwords. It's used for displaying user information and
    profile updates.
    """
    class Meta(UserSerializer.Meta):
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "is_active",
        )
