from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from supabase import create_client

# Initialize Supabase client for sending emails (using service key for admin operations)
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        # get original status
        original_order = self.get_object()
        original_status = original_order.status

        # validate the data
        response = super().update(request, *args, **kwargs)

        if "status" in request.data:
            new_status = request.data["status"]

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
