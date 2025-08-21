from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('secretary', 'Secretaria'),
        ('receptionist', 'Recepcionista'),
        ('owner', 'Propietario'),
        ('tenant', 'Inquilino'),
    )
    role = models.CharField(max_length=12, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f'{self.username} ({self.role})'
