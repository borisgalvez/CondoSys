from django.db import models
from django.utils import timezone
from apps.users.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, EmailValidator
UNIT_CHOICES = [
        ('gallon', 'Galón'),
        ('m3', 'Metro cúbico'),
    ]
class Config(models.Model):
    gas_price_per_gallon = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    gas_price_per_cubic_meter = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True,
        blank=True
    )
    billing_day_of_month = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(28)], 
        null=True,
        blank=True
    )
    preferred_unit = models.CharField(max_length=6, choices=UNIT_CHOICES, default='gallon')
    email_admin = models.EmailField(
        'Correo administrador',
        validators=[EmailValidator()],
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    @classmethod
    def get_singleton(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
    class Meta:
        verbose_name = "Configuración de Facturación"

    def __str__(self):
        return f"Precio: ${self.gas_price_per_gallon} | Corte día {self.billing_day_of_month}"

class ConfigChangeLog(models.Model):
    config = models.ForeignKey(Config, on_delete=models.CASCADE, related_name='changes')
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_config')
    old_gas_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    old_gas_cubic_meter_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    old_preferred_unit = models.CharField(max_length=6, choices=UNIT_CHOICES, null=True)
    old_billing_day = models.PositiveSmallIntegerField(null=True)
    new_gas_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    new_gas_cubic_meter_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    new_preferred_unit = models.CharField(max_length=6, choices=UNIT_CHOICES, null=True)
    new_billing_day = models.PositiveSmallIntegerField(null=True)
    changed_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-changed_at']
        verbose_name = "Bitácora de Cambios"

    def __str__(self):
        return f"Cambio el {self.changed_at.strftime('%Y-%m-%d')}"