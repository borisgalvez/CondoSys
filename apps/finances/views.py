from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Invoice, Payment, Expense, ExtraordinaryPayment, PayrollPayment, RepairPayment, ElectricityPayment, ElectricityPaymentDetail
from .serializers import InvoiceSerializer, PaymentSerializer, ExpenseSerializer, ExtraordinaryPaymentSerializer, PayrollPaymentSerializer, RepairPaymentSerializer, ElectricityPaymentSerializer, ElectricityPaymentDetailUpdateSerializer, ElectricityPaymentDetailSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from ..users.permissions import IsAdminOrSecretary
from datetime import datetime
from rest_framework import status
from django.db import transaction
from rest_framework import serializers
from apps.buildings.models import GasReading
from apps.buildings.serializers import GasReadingSerializer
from datetime import date
from apps.common.services.email_service import CondominioEmailService

class InvoiceViewSet(ModelViewSet):
    queryset = Invoice.objects.all().order_by('-month')
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context


class PaymentViewSet(ModelViewSet):
    queryset = Payment.objects.all().order_by('-date')
    serializer_class = PaymentSerializer
    def get_permissions(self):
        # Permiso base para todas las acciones
        permission_classes = [IsAuthenticated]
        # Permiso adicional para creación
        if self.action == 'create':
            permission_classes.append(IsAdminOrSecretary)
        return [permission() for permission in permission_classes]
    def get_queryset(self):
        return Payment.objects.select_related(
            'invoice__apartment'  # Optimiza con un solo JOIN
        ).all()
    def perform_create(self, serializer):
        serializer.save()


class ExpenseViewSet(ModelViewSet):
    queryset = Expense.objects.all().order_by('-date')
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ExtraordinaryPaymentViewSet(ModelViewSet):
    queryset = ExtraordinaryPayment.objects.all().order_by('-created_at')
    serializer_class = ExtraordinaryPaymentSerializer
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save(created_by=request.user)
        try:
            expense_data = {
                'description': payment.description,
                'amount': payment.amount,
                'date': payment.payment_date_registered,
                'category': 'Electricidad - Áreas comunes',
            }
            expense_serializer = ExpenseSerializer(data=expense_data)
            expense_serializer.is_valid(raise_exception=True)
            expense_serializer.save(created_by=request.user)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class PayrollPaymentViewSet(ModelViewSet):
    queryset = PayrollPayment.objects.all()
    serializer_class = PayrollPaymentSerializer
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def perform_create(self, serializer):
        payroll_payment = serializer.save(created_by=self.request.user)
        try:
            expense_data = {
                'description': f"Nómina: {payroll_payment.get_employee_type_display()} - {payroll_payment.employee_name}",
                'amount': payroll_payment.amount,
                'date': payroll_payment.payment_date,
                'category': "Nómina de pagos",
            }
            """ 'created_by': self.request.user, """
            expense_serializer = ExpenseSerializer(data=expense_data)
            expense_serializer.is_valid(raise_exception=True)
            expense = expense_serializer.save(created_by=self.request.user)
            payroll_payment.expense = expense
            payroll_payment.save()
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    def get_queryset(self):
        """Filtra por fecha si se proporciona"""
        queryset = super().get_queryset()
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(payment_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(payment_date__lte=date_to)
        return queryset.order_by('-payment_date')


class RepairPaymentViewSet(ModelViewSet):
    queryset = RepairPayment.objects.all().order_by('-payment_date')
    serializer_class = RepairPaymentSerializer
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def perform_create(self, serializer):
        repair_payment = serializer.save(registered_by=self.request.user)
        expense_data = {
            'description': f"Pago realizado por usuario: {repair_payment.paid_by_user} - con rol: {repair_payment.paid_by_role}",
            'amount': repair_payment.cost,
            'date': repair_payment.payment_date.date(),
            'category': "Pago por mantenimiento o reparación",
        }
        expense_serializer = ExpenseSerializer(data=expense_data)
        if not expense_serializer.is_valid():
            raise serializers.ValidationError(expense_serializer.errors)
        expense_serializer.save(created_by=self.request.user)


class ElectricityPaymentViewSet(ModelViewSet):
    queryset = ElectricityPayment.objects.all().order_by('-payment_date_registered')
    serializer_class = ElectricityPaymentSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):
        payment = serializer.save(created_by=self.request.user)
        details_data = self.request.data.get('details', [])
        emails_to_send = []
        for detail in details_data:
            amount = detail.get('amount', 0)
            if amount > 0:
                """ ElectricityPaymentDetail.objects.create(
                    electricity_payment=payment,
                    apartment_id=detail.get('apartment_id'),
                    amount=amount,
                    payment_record=self.request.user
                ) """
                detail_instance = ElectricityPaymentDetail.objects.create(
                    electricity_payment=payment,
                    apartment_id=detail.get('apartment_id'),
                    amount=amount,
                    payment_record=self.request.user
                )
                apartment = detail_instance.apartment
                tenant = getattr(apartment, 'tenant', None)
                if tenant and tenant.email:
                    emails_to_send.append({
                        'recipient_email': tenant.email,
                        'context': {
                            'user': tenant,
                            'month': date.today().strftime("%B %Y"),
                            'due_date': (date.today().replace(day=28)).strftime("%d/%m/%Y"),
                            'amount': amount,
                        }
                    })
        try:
            expense_data = {
                'description': payment.description or "Pago electricidad",
                'amount': payment.amount,
                'date': payment.payment_date_registered,
                'category': 'Electricidad - Áreas comunes',
            }
            expense_serializer = ExpenseSerializer(data=expense_data)
            expense_serializer.is_valid(raise_exception=True)
            expense = expense_serializer.save(created_by=self.request.user)

            payment.expense = expense
            payment.save()
        except Exception as e:
            raise serializers.ValidationError(f"Error creando el gasto: {str(e)}")
        for email_data in emails_to_send:
            CondominioEmailService.send_email(
                recipient_email=email_data['recipient_email'],
                email_type='payment',
                context=email_data['context'],
            )
        

class ElectricityPaymentDetailViewSet(ModelViewSet):
    queryset = ElectricityPaymentDetail.objects.all().select_related('apartment', 'electricity_payment')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ElectricityPaymentDetailUpdateSerializer
        return ElectricityPaymentDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        payment_id = self.request.query_params.get('electricity_payment')
        apartment_id = self.request.query_params.get('apartment')
        
        if payment_id:
            queryset = queryset.filter(electricity_payment_id=payment_id)
        if apartment_id:
            queryset = queryset.filter(apartment_id=apartment_id)

        return queryset
    def partial_update(self, request, *args, **kwargs):
        detail = self.get_object()

        if detail.paid_person is not None:
            return Response({'error': 'Este detalle ya está pagado.'}, status=status.HTTP_400_BAD_REQUEST)

        apartment = detail.apartment
        tenant = getattr(apartment, 'tenant', None)  # Asumiendo que apartment tiene un campo 'tenant'

        if tenant is None:
            return Response({'error': 'El apartamento no tiene un inquilino asignado.'}, status=status.HTTP_400_BAD_REQUEST)

        detail.paid_person = tenant
        detail.save()

        serializer = self.get_serializer(detail)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FinanceReportViewSet(ModelViewSet):
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    @action(detail=False, methods=['get'])
    def summary(self, request):
        apartment_id = request.query_params.get('apartment_id', None)
        month = request.query_params.get('month', None)  # Formato YYYY-MM o MM
        block = request.query_params.get('block', None)
        payment_filters = {'confirmed': True}
        expense_filters = {}
    
        if apartment_id:
            payment_filters['invoice__apartment__id'] = apartment_id
        if block:
            expense_filters['block__id'] = block
        if month:
            if '-' in month:  # Formato YYYY-MM
                year, month_num = month.split('-')
            else:  # Solo MM, usamos año actual
                year = datetime.now().year
                month_num = month
        
            payment_filters.update({
                'date__year': year,
                'date__month': month_num
            })
            expense_filters.update({
                'date__year': year,
                'date__month': month_num
            })
        payments_query = Payment.objects.select_related('invoice__apartment').filter(**payment_filters)
        total_incomes = payments_query.aggregate(total=Sum('amount'))['total'] or 0
        expenses_query = Expense.objects.filter(**expense_filters).order_by('-date')
        total_expenses = Expense.objects.filter(**expense_filters).aggregate(total=Sum('amount'))['total'] or 0
        expense_serializer = ExpenseSerializer(expenses_query, many=True)
        income_serializer = PaymentSerializer(payments_query, many=True)
        return Response({
            'ingresos': total_incomes,
            'egresos': total_expenses,
            'balance': total_incomes - total_expenses,
            'detalle_egresos': expense_serializer.data,
            'detalle_payments': income_serializer.data
        })


class TransactionHistoryViewSet(ModelViewSet):
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    def list(self, request):
        user = request.user
        role = getattr(user, 'role', None)
        is_admin = role in ['admin', 'secretary']
        if is_admin:
            electricity_qs = ElectricityPaymentDetail.objects.all()
            maintenance_qs = RepairPayment.objects.all()
            payroll_qs = PayrollPayment.objects.all()
            extra_qs = ExtraordinaryPayment.objects.all()
            expense_qs = Expense.objects.all()
            payment_qs = Payment.objects.all()
            reading_qs = GasReading.objects.all()
        else:
            electricity_qs = ElectricityPaymentDetail.objects.filter(paid_person=user)
            maintenance_qs = RepairPayment.objects.filter(paid_by_user=user)
            payroll_qs = PayrollPayment.objects.filter(created_by=user)
            extra_qs = ExtraordinaryPayment.objects.filter(created_by=user)
            expense_qs = Expense.objects.filter(created_by=user)
            payment_qs = Payment.objects.filter(created_by=user)
            reading_qs = GasReading.objects.filter(paid_by_user=user)
        electricity_data = ElectricityPaymentDetailSerializer(electricity_qs, many=True).data
        maintenance_data = RepairPaymentSerializer(maintenance_qs, many=True).data
        payroll_data = PayrollPaymentSerializer(payroll_qs, many=True).data
        extra_data = ExtraordinaryPaymentSerializer(extra_qs, many=True).data
        expense_data = ExpenseSerializer(expense_qs, many=True).data
        payment_data = PaymentSerializer(payment_qs, many=True).data
        reading_data = GasReadingSerializer(reading_qs, many=True).data
        return Response({
            "electricity": electricity_data,
            "maintenance": maintenance_data,
            "payroll": payroll_data,
            "extraordinary": extra_data,
            "expense": expense_data,
            "payment_data": payment_data,
            "reading_data": reading_data
        })