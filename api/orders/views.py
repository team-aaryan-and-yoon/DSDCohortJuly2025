from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProviderOrAdmin
from django.core.mail import send_mail
from decouple import config
from supabase import create_client, Client

url = config("DATABASE_URL")
key = config("SECRET_KEY")
supabase: Client = create_client(url, key)

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
                    message=f"Hello, \n\nThe status of your service {original_order.service_type} has been updated to: {updated_order.get_status_display()} .\n\nThank you!",
                    from_email="noreply@handsoff.com",
                    recipient_list=[client_email],
                    fail_silently=False,
                )

        return response

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

