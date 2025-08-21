from django.db import models
from django.utils import timezone

class EmailLog(models.Model):
    EMAIL_TYPES = [
        ('welcome', 'Correo de bienvenida'),
        ('payment', 'Recordatorio de pago'),
        ('announcement', 'Anuncio general'),
    ]

    STATUS_CHOICES = [
        ('success', 'Éxito'),
        ('failed', 'Fallido'),
    ]

    email_type = models.CharField(max_length=20, choices=EMAIL_TYPES)
    recipient = models.EmailField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    error_message = models.TextField(null=True, blank=True)
    sent_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.get_email_type_display()} a {self.recipient} - {self.status}"
