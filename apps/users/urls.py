from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MeView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet)

""" path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), """
""" path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), """
urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', MeView.as_view(), name='user_me'),
]

urlpatterns += router.urls
