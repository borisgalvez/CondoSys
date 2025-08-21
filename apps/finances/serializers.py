from rest_framework import serializers
from .models import Invoice, Payment, Expense, ExtraordinaryPayment, PayrollPayment, RepairPayment, ElectricityPayment, ElectricityPaymentDetail
from ..buildings.models import Apartment, Block
from ..buildings.serializers import ApartmentSerializer
from apps.buildings.serializers import BlockSerializer
from .services import PaymentService
from rest_framework.exceptions import ValidationError
from decimal import Decimal
from apps.users.serializers import UserSerializer
from apps.users.models import User


class InvoiceSerializer(serializers.ModelSerializer):
    apartment = serializers.PrimaryKeyRelatedField(queryset=Apartment.objects.all())
    apartment_data = ApartmentSerializer(source='apartment', read_only=True)
    class Meta:
        model = Invoice
        fields = ['id', 'apartment', 'apartment_data', 'balance', 'status', 'month', 'amount', 'is_paid']
        extra_kwargs = {
            'balance': {'required': False},
            'status': {'required': False},
        }
    def validate(self, data):
        # Solo validar duplicados en creación, no en edición
        if self.instance is None:
            if Invoice.objects.filter(apartment=data['apartment'], month=data['month']).exists():
                raise ValidationError("Ya existe una factura para este departamento y mes.")
        return data
    def create(self, validated_data):
        validated_data['balance'] = Decimal(validated_data['amount'])
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    invoice = InvoiceSerializer(read_only=True)
    invoice_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'invoice_id', 'amount', 'date', 'reference', 'confirmed',
            'created_by', 'created_at'
        ]
        read_only_fields = ['created_at', 'created_by']
    def create(self, validated_data):
        try:
            return PaymentService.create_payment(
                invoice_id=validated_data['invoice_id'],
                amount=validated_data['amount'],
                user=self.context['request'].user,
                date=validated_data.get('date'),
                reference=validated_data.get('reference'),
                confirmed=validated_data.get('confirmed', False)
            )
        except ValueError as e:
            raise serializers.ValidationError(str(e))


class ExpenseSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    block_data = BlockSerializer(source='block', read_only=True)
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['created_by']

class ExtraordinaryPaymentSerializer(serializers.ModelSerializer):
    block = serializers.PrimaryKeyRelatedField(queryset=Block.objects.all(), required=False, allow_null=True)
    apartment = serializers.PrimaryKeyRelatedField(queryset=Apartment.objects.all(), required=False, allow_null=True)
    block_data = BlockSerializer(source='block', read_only=True)
    apartment_data = ApartmentSerializer(source='apartment', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = ExtraordinaryPayment
        fields = '__all__'
        read_only_fields = ['created_by']

class PayrollPaymentSerializer(serializers.ModelSerializer):
    expense = ExpenseSerializer(read_only=True)
    employee_type_display = serializers.CharField(source='get_employee_type_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = PayrollPayment
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'expense']


class RepairPaymentSerializer(serializers.ModelSerializer):
    paid_by_user = serializers.StringRelatedField(read_only=True)
    registered_by = serializers.StringRelatedField(read_only=True)
    paid_by_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='paid_by_user',
        write_only=True
    )
    class Meta:
        model = RepairPayment
        fields = '__all__'
        read_only_fields = ['created_at', 'registered_by']


class ElectricityPaymentDetailSerializer(serializers.ModelSerializer):
    payment_record = serializers.StringRelatedField(read_only=True)
    paid_person = serializers.StringRelatedField(read_only=True)
    apartment_id = serializers.IntegerField()
    class Meta:
        model = ElectricityPaymentDetail
        fields = '__all__'
        read_only_fields = ['id', 'electricity_payment', 'apartment', 'amount', 'payment_record', 'paid_person']


class ElectricityPaymentDetailUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityPaymentDetail
        fields = ['payment_record', 'paid_person', ]


class ElectricityPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityPayment
        fields = [
            'id', 'amount', 'distribution_type', 'description',
            'payment_date_registered', 'payment_date_paid',
            'created_by', 'expense', 'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'expense', 'paid_person', 'created_at']