from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from decouple import config
from supabase import create_client
from utils.constants import get_display_status


# url: str = config("SUPABASE_URL")
# key: str = config("SUPABASE_SERVICE_KEY")
# supabase: Client = create_client(url, key)


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().select_related("client", "provider")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "order_num"

    def update(self, request, *args, **kwargs):
        # Get original order for later comparison
        original_order = self.get_object()
        original_status = original_order.status

        # Process the request through the serializer
        response = super().update(request, *args, **kwargs)

        # If this was a status update and it was successful, send an email notification
        if "status" in request.data and response.status_code == 200:
            # Get the updated order
            updated_order = self.get_object()

            # Only send email if status actually changed
            if updated_order.status != original_status:
                self._send_status_update_email(updated_order)

        return response

    def _send_status_update_email(self, order):
        """Helper method to send status update emails"""
        try:
            # Get client email from Supabase
            url = config("SUPABASE_URL")
            key = config("SUPABASE_SERVICE_KEY")
            supabase = create_client(url, key)

            if not order.client or not order.client.supabase_id:
                return

            client_supabase_id = str(order.client.supabase_id.id)
            user_response = supabase.auth.admin.get_user_by_id(client_supabase_id)
            client_email = user_response.user.email

            # Get display status for the email
            status_display = get_display_status(order.status)

            # Send the email
            send_mail(
                subject=f"Update on your order: {order.order_num}",
                message=f"Hello,\n\nThe status of your service {order.service_type} has been updated to: {status_display}.\n\nThank you!",
                from_email=config("EMAIL_HOST_USER"),
                recipient_list=[client_email],
                fail_silently=False,
            )
        except Exception:
            # Don't let email failures affect the API response
            pass

    def partial_update(self, request, *args, **kwargs):
        # Get original order for later comparison
        original_order = self.get_object()
        original_status = original_order.status

        # Process the request through the serializer
        response = super().partial_update(request, *args, **kwargs)

        # If this was a status update and it was successful, send an email notification
        if "status" in request.data and response.status_code == 200:
            # Get the updated order
            updated_order = self.get_object()

            # Only send email if status actually changed
            if updated_order.status != original_status:
                self._send_status_update_email(updated_order)

        return response

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()

        # Get the user's profile (attached by SupabaseAuth)
        profile = getattr(self.request, "profile", None)
        if not profile:
            return Order.objects.none()

        # Return orders based on user role
        if hasattr(profile, "role") and profile.role == "provider":
            # Providers can see orders assigned to them
            queryset = Order.objects.filter(provider=profile).select_related(
                "client", "provider"
            )
        else:
            # Clients (and users without role) can only see their own orders
            queryset = Order.objects.filter(client=profile).select_related("provider")

        return queryset
