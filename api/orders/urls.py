from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, get_services
from django.urls import path


router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")

urlpatterns = router.urls

urlpatterns += [
    path('services/', get_services, name='get_services'),
]
