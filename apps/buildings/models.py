from django.db import models
from apps.users.models import User

class Condominium(models.Model):
    name = models.CharField(max_length=30)
    def __str__(self):
        return self.nombre


class Block(models.Model):
    name = models.CharField(max_length=10, unique=True)
    condominium = models.ForeignKey(
        Condominium, on_delete=models.CASCADE, related_name='condominiums', null=True, blank=True,)
    class Meta:
        db_table = 'buildings_block'
    def __str__(self):
        return self.name


class Apartment(models.Model):
    block = models.ForeignKey(
        Block, on_delete=models.CASCADE, related_name='apartments')
    number = models.CharField(max_length=10)
    owner = models.ForeignKey(User, null=True, blank=True,
                              on_delete=models.SET_NULL, related_name='owned_apartments')
    tenant = models.ForeignKey(User, null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='rented_apartments')

    class Meta:
        unique_together = ('block', 'number')

    def __str__(self):
        return f"{self.block.name}-{self.number}"


class GasMeter(models.Model):
    apartment = models.OneToOneField(
        'Apartment', on_delete=models.CASCADE, related_name='gas_meter')
    serial_number = models.CharField(max_length=50, unique=True)
    installed_at = models.DateField(auto_now_add=True)
    consumption = models.DecimalField(max_digits=16,decimal_places=2,default=0.00)
    is_paid = models.BooleanField(default=False)
    def __str__(self):
        return f"Medidor {self.serial_number} - {self.apartment}"


class GasReading(models.Model):
    meter = models.ForeignKey(
        GasMeter, on_delete=models.CASCADE, related_name='readings')
    date = models.DateField()
    value_m3 = models.DecimalField(max_digits=10, decimal_places=2)
    gas_value = models.DecimalField(max_digits=10, default=0.00, decimal_places=2)
    total = models.DecimalField(max_digits=12, default=0.00, decimal_places=2,)
    is_paid = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    paid_by_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='paid_gas_reading_user')
    class Meta:
        unique_together = ('meter', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.meter.serial_number} - {self.date} - {self.value_m3} m³ - ${self.total}"

class Maintenance(models.Model):
    type_maintenance = models.CharField(max_length=30)
    id_block = models.ForeignKey(Block, on_delete=models.CASCADE, related_name='maintenance_blocks')
    maintenance_manager = models.CharField(max_length=30)
    description = models.TextField(max_length=255,blank=True, null=True)
    observation = models.TextField(max_length=255,blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True, verbose_name='Fecha de término')
    maintenance_expense = models.DecimalField(
        max_digits=16,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Gasto de mantención'
    )

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"Mantenimiento {self.tipo_mantencion} - Bloque {self.id_block}"