from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from apps.common.services.email_service import CondominioEmailService

class UserViewSet(ModelViewSet):
    # <- esta línea soluciona el warning
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        user = serializer.save()
        password = self.request.data.get('password', '')
        context = {
            'user': user,
            'password': password,
        }
        CondominioEmailService.send_email(
            recipient_email=user.email,
            email_type='welcome',
            context=context
        )
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        related_data = {
            'propietarios': user.owned_apartments.count(),
            'inquilinos': user.rented_apartments.count(),
            'registro_pagos': user.created_payments.count(),
            'actualizo_la_configuracion': user.updated_config.count()
        }
        active_relations = {k: v for k, v in related_data.items() if v > 0}
        if active_relations:
            return Response({
                'error': 'Relaciones activas',
                'details': {
                    'message': 'El usuario tiene datos asociados',
                    'relations': active_relations
                }
            }, status=status.HTTP_423_LOCKED)
        return super().destroy(request, *args, **kwargs)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer