from rest_framework.permissions import BasePermission

class IsAdminOrSecretary(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'secretary']