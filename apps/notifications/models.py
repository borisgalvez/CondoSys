from django.db import models
from apps.users.models import User

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('email', 'Email'),
        ('app', 'Aplicación'),
        ('both', 'Ambos'),
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    recipients = models.ManyToManyField(User, related_name='received_notifications')
    message = models.TextField()
    notification_type = models.CharField(max_length=5, choices=NOTIFICATION_TYPES, default='app')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notificación de {self.sender} - {self.created_at}"