from django.db import models
from apps.buildings.models import Apartment
from apps.users.models import User
from apps.buildings.models import Block


class Invoice(models.Model):
    apartment = models.ForeignKey(
        Apartment, on_delete=models.CASCADE, related_name='invoices')
    month = models.DateField()  # siempre usar el primer día del mes (ej: 2024-03-01)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    STATUS_CHOICES = [
        ('unpaid', 'Sin pagar'),
        ('partially_paid', 'Pago Parcial'),
        ('paid', 'Pagada'),
        ('overpaid', 'Sobrepagada')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.apartment} - {self.month.strftime('%B %Y')}"


class Payment(models.Model):
    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name='payments')
    created_by = models.ForeignKey(
        User,
        related_name='created_payments',
        on_delete=models.SET_NULL,
        null=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    reference = models.CharField(max_length=100, blank=True)
    confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pago {self.amount} a {self.invoice}"


class Expense(models.Model):
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=100)
    document_url = models.URLField(blank=True, null=True)
    block = models.ForeignKey(Block,on_delete=models.SET_NULL, related_name='expenses', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    class Meta:
        db_table = 'finances_expense'
    def __str__(self):
        return f"{self.description} - {self.amount} ({self.date})"


class ExtraordinaryPayment(models.Model):
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=100)
    document_url = models.URLField(blank=True, null=True)
    block = models.ForeignKey(Block,on_delete=models.SET_NULL, related_name='extraordinary_payment_block', null=True, blank=True)
    apartment =  models.ForeignKey(Apartment,on_delete=models.SET_NULL, related_name='extraordinary_payment_apartment', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.description} - {self.amount} ({self.date})"
    
class PayrollPayment(models.Model):
    EMPLOYEE_TYPES = [
        ('CLEANING', 'Limpieza'),
        ('ADMIN', 'Administración'),
        ('SECURITY', 'Seguridad'),
        ('OTHER', 'Otro'),
    ]
    PAYMENT_METHODS = [
        ('CASH', 'Efectivo'),
        ('TRANSFER', 'Transferencia'),
        ('QR', 'qr'),
    ]
    employee_name = models.CharField(max_length=200)
    employee_type = models.CharField(max_length=20, choices=EMPLOYEE_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    expense = models.OneToOneField(
        Expense,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payroll_payment'
    )

    def __str__(self):
        return f"{self.employee_name} - {self.amount} - {self.payment_date}"
    

class RepairPayment(models.Model):
    REPAIR_TYPES = (
        ('plumbing', 'Plomería'),
        ('electrical', 'Eléctrico'),
        ('painting', 'Pintura'),
        ('other', 'Otro'),
    )
    PAYMENT_RESPONSIBILITY = (
        ('tenant', 'Inquilino'),
        ('owner', 'Propietario'),
        ('admin', 'Administración'),
    )
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='repair_payments')
    repair_type = models.CharField(max_length=30, choices=REPAIR_TYPES)
    description = models.TextField(max_length=255, blank=True, null=True)
    cost = models.DecimalField(max_digits=16, decimal_places=2)
    payment_date = models.DateTimeField()
    paid_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='repair_payments_made')
    paid_by_role = models.CharField(max_length=15, choices=PAYMENT_RESPONSIBILITY)
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='repair_payments_registered')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reparación {self.repair_type} en {self.housing_unit} por {self.cost}"
    

class ElectricityPayment(models.Model):
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    distribution_type = models.CharField(max_length=20)
    description = models.CharField(max_length=255, blank=True, null=True)
    payment_date_registered = models.DateField()
    payment_date_paid = models.DateField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="electricity_payments")
    expense = models.ForeignKey(Expense, on_delete=models.SET_NULL, null=True, blank=True, related_name="electricity_payment")
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Pago electricidad {self.amount} el {self.payment_date}"
    

class ElectricityPaymentDetail(models.Model):
    electricity_payment = models.ForeignKey(ElectricityPayment, on_delete=models.CASCADE, related_name="details")
    apartment = models.ForeignKey(Apartment, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_record = models.ForeignKey(User, on_delete=models.PROTECT, related_name="electricity_payment_record", blank=True, null=True)
    paid_person = models.ForeignKey(User, on_delete=models.PROTECT, related_name="electricity_paid_person_paid", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 