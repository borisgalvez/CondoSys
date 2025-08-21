from django.db import transaction
from django.db.models import Sum 
from .models import Payment, Invoice
from enum import Enum

class InvoiceStatus(Enum):
    UNPAID = 'unpaid'
    PARTIAL = 'partially_paid'
    PAID = 'paid'
    OVERPAID = 'overpaid'

class PaymentService:
    @staticmethod
    @transaction.atomic
    def create_payment(invoice_id, amount, user, **extra_fields):
        if amount <= 0:
            raise ValueError("El monto del pago debe ser positivo")  
        invoice = Invoice.objects.select_for_update().get(id=invoice_id)
        if invoice.status == InvoiceStatus.PAID.value:
            raise ValueError("La factura ya está completamente pagada")
        
        payment = Payment.objects.create(
            invoice=invoice,
            amount=amount,
            created_by=user,
            **extra_fields
        )
        PaymentService._update_invoice_status(invoice)
        return payment

    @staticmethod
    def _update_invoice_status(invoice):
        """Actualiza el estado con más granularidad"""
        total_pagado = invoice.payments.aggregate(total=Sum('amount'))['total'] or 0
        balance = invoice.amount - total_pagado
        if total_pagado <= 0:
            status = InvoiceStatus.UNPAID.value
        elif 0 < total_pagado < invoice.amount:
            status = InvoiceStatus.PARTIAL.value
        elif balance == 0:
            status = InvoiceStatus.PAID.value
            invoice.is_paid = True
        else:
            status = InvoiceStatus.OVERPAID.value
        invoice.status = status
        invoice.balance = balance
        invoice.save()