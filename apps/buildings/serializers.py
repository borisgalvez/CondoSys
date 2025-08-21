from rest_framework import serializers
from .models import Apartment, Block, GasMeter, GasReading, Maintenance, Condominium
from apps.users.models import User


class ApartmentSerializer(serializers.ModelSerializer):
    block = serializers.SlugRelatedField(
        slug_field='name', queryset=Block.objects.all())
    owner = serializers.SlugRelatedField(
        slug_field='username', queryset=User.objects.all(), allow_null=True, required=False)
    tenant = serializers.SlugRelatedField(
        slug_field='username', queryset=User.objects.all(), allow_null=True, required=False)
    block_id = serializers.PrimaryKeyRelatedField(queryset=Block.objects.all(), required=False)
    class Meta:
        model = Apartment
        fields = ['id', 'block', 'block_id', 'number', 'owner', 'tenant']


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['id', 'name', 'condominium']

class CondominiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condominium
        fields = ['id', 'name']


class GasReadingSerializer(serializers.ModelSerializer):
    meter = serializers.SlugRelatedField(
        slug_field='id', queryset=GasMeter.objects.all())
    paid_by_user = serializers.StringRelatedField(read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = GasReading
        fields = ['id', 'meter', 'date', 'value_m3', 'gas_value', 'total', 'is_paid', 'paid_by_user', 'created_by']
        read_only_fields = ['created_by']


class GasMeterSerializer(serializers.ModelSerializer):
    apartment = serializers.SlugRelatedField(
        slug_field='id', queryset=Apartment.objects.all())
    readings = GasReadingSerializer(many=True, read_only=True)

    class Meta:
        model = GasMeter
        fields = ['id', 'serial_number', 'consumption',
                  'apartment', 'installed_at', 'readings', 'is_paid']

class MaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maintenance
        fields = '__all__'