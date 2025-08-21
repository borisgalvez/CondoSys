from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Config, ConfigChangeLog
from .serializers import ConfigUpdateSerializer, ConfigChangeLogSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigUpdateSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        config, _ = Config.objects.get_or_create(pk=1)
        return Config.objects.filter(pk=config.pk)

    def partial_update(self, request, pk=None):
        instance = self.get_object()
        old_data = {
            'gas_price': instance.gas_price_per_gallon,
            'billing_day': instance.billing_day_of_month,
            'gas_price_per_cubic_meter': instance.gas_price_per_cubic_meter,
            'preferred_unit': instance.preferred_unit,
        }
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        ConfigChangeLog.objects.create(
            config=instance,
            changed_by=request.user,
            old_gas_price=old_data['gas_price'] if 'gas_price_per_gallon' in serializer.validated_data else None,
            new_gas_price=serializer.validated_data.get('gas_price_per_gallon'),
            old_billing_day=old_data['billing_day'] if 'billing_day_of_month' in serializer.validated_data else None,
            new_billing_day=serializer.validated_data.get('billing_day_of_month'),
            old_gas_cubic_meter_price=old_data['gas_price_per_cubic_meter'] if serializer.validated_data else None,
            new_gas_cubic_meter_price=serializer.validated_data.get('gas_price_per_cubic_meter'),
            old_preferred_unit=old_data['preferred_unit'] if serializer.validated_data else None,
            new_preferred_unit=serializer.validated_data.get('preferred_unit'),
        )
        
        return Response(serializer.data)

class ConfigChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConfigChangeLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        config = Config.objects.get(pk=1)
        return ConfigChangeLog.objects.filter(config=config).order_by('-changed_at')