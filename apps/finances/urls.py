from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, PaymentViewSet, ExpenseViewSet, FinanceReportViewSet, ExtraordinaryPaymentViewSet, PayrollPaymentViewSet, RepairPaymentViewSet, ElectricityPaymentViewSet, ElectricityPaymentDetailViewSet, TransactionHistoryViewSet

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'extraordinary-payment', ExtraordinaryPaymentViewSet)
router.register(r'reports', FinanceReportViewSet, basename='finance-report')
router.register(r'payroll', PayrollPaymentViewSet)
router.register(r'repair-payments', RepairPaymentViewSet)
router.register(r'electricity-payments', ElectricityPaymentViewSet)
router.register(r'electricity-payment-details', ElectricityPaymentDetailViewSet, basename='electricity-payment-details')
router.register(r'finance-history', TransactionHistoryViewSet, basename='history'),

urlpatterns = router.urls
