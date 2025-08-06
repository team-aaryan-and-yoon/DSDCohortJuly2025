from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProviderOrAdmin
from django.core.mail import send_mail
from decouple import config
from supabase import create_client, Client

url: str = config("DATABASE_URL")
key: str = config("SECRET_KEY")


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated, IsProviderOrAdmin]

    def update(self, request, *args, **kwargs):
        
        # get original status
        original_order = self.get_object()
        original_status = original_order.status

        # validate the data
        response = super().update(request, *args, **kwargs)

        if 'status' in request.data:
            new_status = request.data['status']

            if new_status != original_status:
                updated_order = self.get_object()

                client_supabase_id = str(updated_order.client.supabase_id)
                user_response = supabase.auth.admin.get_user_by_id(client_supabase_id)
                client_email = user_response.user.email

                send_mail(
                    subject=f"Update on your order: {original_order.order_num}",
                    message=f"Hello, \n\nThe status of your service {original_order.service_type} has been updated to: {new_status} .\n\nThank you!",
                    from_email="noreply@handsoff.com",
                    recipient_list=[client_email],
                    fail_silently=False,
                )

        return response