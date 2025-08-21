from rest_framework import serializers
from .models import Config, ConfigChangeLog
from apps.users.models import User

class ConfigUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ['gas_price_per_gallon', 'billing_day_of_month', 'email_admin', 'gas_price_per_cubic_meter', 'preferred_unit']
        extra_kwargs = {
            'gas_price_per_gallon': {'required': False},
            'billing_day_of_month': {'required': False},
            'email_admin': {'required': False},
            'gas_price_per_cubic_meter': {'required': False},
            'preferred_unit': {'required': False}
        }

class ConfigChangeLogSerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()
    class Meta:
        model = ConfigChangeLog
        fields = '__all__'
