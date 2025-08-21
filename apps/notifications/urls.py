from django.urls import path
from .views import NotificationViewSet

app_name = 'notifications'

urlpatterns = [
    # Tus patrones de URL aquí
    path('', NotificationViewSet.as_view({'get': 'list', 'post': 'create'}), name='notification-list'),
    path('<int:pk>/', NotificationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='notification-detail'),
    path('sent/', NotificationViewSet.as_view({'get': 'sent'}), name='notification-sent'),
    path('unread/', NotificationViewSet.as_view({'get': 'unread'})),
    path('unread/count/', NotificationViewSet.as_view({'get': 'unread_count'})),
    path('<int:pk>/mark_as_read/', NotificationViewSet.as_view({'post': 'mark_as_read'}), name='notification-mark-read'),
]