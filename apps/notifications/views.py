# notifications/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer
from apps.users.models import User
from django.core.mail import send_mail
from django.conf import settings
from apps.common.services.email_service import CondominioEmailService

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filtra notificaciones por usuario y tipo de acción"""
        user = self.request.user
        
        if self.action == 'sent':
            # Notificaciones enviadas por el usuario
            return self.queryset.filter(sender=user)
        elif self.action == 'unread':
            # Notificaciones no leídas para el usuario
            return self.queryset.filter(recipients=user, is_read=False)
        elif self.action == 'unread_count':
            # Solo necesita contar, no recuperar objetos completos
            return self.queryset.filter(recipients=user, is_read=False)
        
        # Notificaciones recibidas por el usuario (comportamiento por defecto)
        return self.queryset.filter(recipients=user)

    def perform_create(self, serializer):
        """Asigna el remitente automáticamente"""
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Notificaciones enviadas por el usuario"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Notificaciones no leídas para el usuario actual"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Cantidad de notificaciones no leídas"""
        count = self.get_queryset().count()
        return Response({'count': count})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marcar notificación como leída"""
        notification = self.get_object()
        
        # Verificar que el usuario actual es destinatario
        if request.user not in notification.recipients.all():
            return Response(
                {'error': 'No tienes permiso para esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    def create(self, request, *args, **kwargs):
        """Sobreescribir create para enviar emails si es necesario"""
        # Solo administradores pueden enviar notificaciones
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo los administradores pueden enviar notificaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        notification = serializer.instance
        
        # Enviar email si corresponde
        if notification.notification_type in ['email', 'both']:
            self._send_notification_emails(notification)
        
        # Enviar notificación por WebSocket si está configurado
        self._send_websocket_notification(notification)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def _send_notification_emails(self, notification):
        """Envía emails a los destinatarios"""
        for user in notification.recipients.all():
            context = {
                'user': user,
                'announcement_text': notification.message,
            }
            CondominioEmailService.send_email(
                recipient_email=user.email,
                email_type='announcement',
                context=context,
            )

    def _send_websocket_notification(self, notification):
        """Envía notificación por WebSocket a los destinatarios"""
        try:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            
            channel_layer = get_channel_layer()
            for recipient in notification.recipients.all():
                async_to_sync(channel_layer.group_send)(
                    f"user_{recipient.id}",
                    {
                        'type': 'notify_user',
                        'content': {
                            'type': 'notification',
                            'id': notification.id,
                            'message': notification.message,
                            'sender': notification.sender.username,
                            'is_read': notification.is_read,
                            'created_at': notification.created_at.isoformat()
                        }
                    }
                )
        except ImportError:
            # Channels no está instalado, ignorar
            pass
        except Exception as e:
            # Loggear error pero no interrumpir el flujo
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error enviando notificación por WebSocket: {str(e)}")