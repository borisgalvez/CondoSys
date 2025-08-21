from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging
from apps.common.models import EmailLog
from django.utils import timezone

logger = logging.getLogger(__name__)

class CondominioEmailService:
    """
    Servicio para envío de correos
    """

    @staticmethod
    def send_email(recipient_email, email_type, context, attachments=None, cc=None, bcc=None, reply_to=None):
        try:
            # Renderizar contenido desde templates
            subject = render_to_string(f'emails/{email_type}/subject.txt', context).strip()
            text_body = render_to_string(f'emails/{email_type}/body.txt', context)
            html_body = render_to_string(f'emails/{email_type}/body.html', context)

            # Crear email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient_email],
                cc=cc,
                bcc=bcc,
                reply_to=reply_to or [settings.DEFAULT_FROM_EMAIL],
            )
            email.attach_alternative(html_body, "text/html")

            # Adjuntar archivos (opcional)
            if attachments:
                for filename, content, mimetype in attachments:
                    email.attach(filename, content, mimetype)

            email.send()

            # Log en base de datos
            CondominioEmailService._log_email(
                email_type=email_type,
                recipient=recipient_email,
                status='success'
            )
            return True

        except Exception as e:
            logger.error(f"Error enviando email '{email_type}' a '{recipient_email}': {str(e)}")
            CondominioEmailService._log_email(
                email_type=email_type,
                recipient=recipient_email,
                status='failed',
                error_message=str(e)
            )
            return False

    @staticmethod
    def _log_email(email_type, recipient, status, error_message=None):
        try:
            EmailLog.objects.create(
                email_type=email_type,
                recipient=recipient,
                status=status,
                error_message=error_message,
                sent_at=timezone.now()
            )
        except Exception as e:
            logger.error(f"Error registrando email en BD: {str(e)}")
