# settings_config/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Config

@receiver(post_migrate)
def create_default_config(sender, **kwargs):
    if sender.name == 'apps.settings':  # Solo ejecutar para tu app
        Config.objects.get_or_create(pk=1)