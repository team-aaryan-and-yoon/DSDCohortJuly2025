from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    # Uncomment to enable authentication
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Uncomment to enable authentication
        # user = self.request.user
        # if not user.is_authenticated:
        #     return Order.objects.none()
        #
        # return Order.objects.filter(client=user.profile).select_related("provider")

        # For testing purposes, before we add auth
        return Order.objects.all()
