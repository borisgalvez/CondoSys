from rest_framework.routers import DefaultRouter
from .views import ConfigViewSet, ConfigChangeLogViewSet

router = DefaultRouter()
router.register(r'config', ConfigViewSet, basename='config')
router.register(r'config-logs', ConfigChangeLogViewSet, basename='config-logs')

urlpatterns = router.urls