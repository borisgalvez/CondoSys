from rest_framework.routers import DefaultRouter
from .views import ApartmentViewSet, BlockViewSet, GasMeterViewSet, GasReadingViewSet, MaintenanceViewSet, CondominiumViewSet

router = DefaultRouter()
router.register(r'apartments', ApartmentViewSet)
router.register(r'blocks', BlockViewSet)
router.register(r'gas-meters', GasMeterViewSet)
router.register(r'gas-readings', GasReadingViewSet)
router.register(r'maintenances', MaintenanceViewSet)
router.register(r'condominiums', CondominiumViewSet)

urlpatterns = router.urls
