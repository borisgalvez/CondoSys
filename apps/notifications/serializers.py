# notifications/serializers.py
from rest_framework import serializers
from .models import Notification
from apps.users.models import User
from apps.users.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipients = UserSerializer(many=True, read_only=True)
    recipient_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        write_only=True,
        source='recipients'
    )
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'recipients', 'recipient_ids', 'message', 
                 'notification_type', 'created_at', 'is_read']
        read_only_fields = ['sender', 'created_at']