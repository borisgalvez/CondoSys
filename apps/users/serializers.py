from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password],  # Valida complejidad del password
        style={'input_type': 'password'}  # Para que el frontend lo muestre como campo de contraseña
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email',
                  'first_name', 'last_name', 'role', 'phone']

        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        if 'password' not in validated_data:
            raise serializers.ValidationError({"password": "This field is required."})
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', ''),
            phone=validated_data.get('phone', '')
        )
        return user
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'role': self.user.role,
        })
        return data