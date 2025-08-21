from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Apartment, Block, GasMeter, GasReading, Maintenance, Condominium
from .serializers import ApartmentSerializer, BlockSerializer, GasMeterSerializer, GasReadingSerializer, MaintenanceSerializer, CondominiumSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.finances.serializers import ExpenseSerializer
from rest_framework.decorators import action
from apps.common.services.email_service import CondominioEmailService


class ApartmentViewSet(ModelViewSet):
    queryset = Apartment.objects.all().order_by('block__name', 'number')
    serializer_class = ApartmentSerializer
    permission_classes = [IsAuthenticated]


class CondominiumViewSet(ModelViewSet):
    queryset = Condominium.objects.all().order_by('name')
    serializer_class = CondominiumSerializer
    permission_classes = [IsAuthenticated]


class BlockViewSet(ModelViewSet):
    queryset = Block.objects.all().order_by('name')
    serializer_class = BlockSerializer
    permission_classes = [IsAuthenticated]


class GasMeterViewSet(ModelViewSet):
    queryset = GasMeter.objects.all()
    serializer_class = GasMeterSerializer
    permission_classes = [IsAuthenticated]
    @action(detail=False, methods=['get'])
    def apartments_status(self, request):
        # Apartamentos con medidor
        apartments_with_meter = Apartment.objects.filter(gas_meter__isnull=False)
        # Apartamentos sin medidor
        apartments_without_meter = Apartment.objects.filter(gas_meter__isnull=True)

        # Construyes una lista con ambos
        with_meter = [
            {
                'apartment': ApartmentSerializer(apartment).data,
                'gas_meter': GasMeterSerializer(apartment.gas_meter).data,
            }
            for apartment in apartments_with_meter
        ]

        without_meter = [
            {
                'apartment': ApartmentSerializer(apartment).data,
                'gas_meter': None,
            }
            for apartment in apartments_without_meter
        ]

        return Response({
            'with_meter': with_meter,
            'without_meter': without_meter,
        })


class GasReadingViewSet(ModelViewSet):
    queryset = GasReading.objects.all()
    serializer_class = GasReadingSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        meter = instance.meter
        meter.consumption += instance.value_m3
        meter.save(update_fields=['consumption'])
        apartment = getattr(meter, 'apartment', None)
        if apartment:
            tenant = getattr(apartment, 'tenant', None)
            if tenant and tenant.email:
                context = {
                    'user': tenant,
                    'month': instance.date.strftime("%B %Y"),
                    'due_date': (instance.date.replace(day=28)).strftime("%d/%m/%Y"),
                    'amount': instance.total,
                }
                CondominioEmailService.send_email(
                    recipient_email=tenant.email,
                    email_type='payment',
                    context=context,
                )
    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_paid:
            return Response(
                {'error': 'Esta lectura ya estaba marcada como pagada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            with transaction.atomic():
                meter = instance.meter
                apartment = getattr(meter, 'apartment', None)
                if not apartment:
                    return Response(
                        {'error': 'El medidor no está asignado a ningún apartamento.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                tenant = getattr(apartment, 'tenant', None)
                if not tenant:
                    return Response(
                        {'error': f'El apartamento {apartment.number} no tiene inquilino asignado.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                instance.is_paid = True
                instance.paid_by_user = tenant 
                instance.save()
                meter = instance.meter
                apartment = getattr(meter, 'apartment', None)
                expense_data = {
                    'description': f"Pago de gas - Medidor {meter.serial_number} ({instance.date})",
                    'amount': float(instance.total),
                    'date': instance.date,
                    'category': 'Servicios Públicos',
                    'block': apartment.block_id if apartment and hasattr(apartment, 'block_id') else None
                }   
                expense_serializer = ExpenseSerializer(data=expense_data)
                expense_serializer.is_valid(raise_exception=True)
                expense_serializer.save(created_by=self.request.user)
                return Response({
                    'reading': GasReadingSerializer(instance).data,
                    'expense': expense_serializer.data
                }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class MaintenanceViewSet(ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
    filterset_fields = ['id_block', 'type_maintenance']
    permission_classes = [IsAuthenticated]