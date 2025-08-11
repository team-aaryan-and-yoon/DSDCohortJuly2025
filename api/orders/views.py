from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from decouple import config
from supabase import create_client, Client


# url: str = config("SUPABASE_URL")
# key: str = config("SUPABASE_SERVICE_KEY")
# supabase: Client = create_client(url, key)


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().select_related("client", "provider")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "order_num"

    def update(self, request, *args, **kwargs):
        # get original status
        original_order = self.get_object()
        original_status = original_order.status

        # validate the data
        response = super().update(request, *args, **kwargs)

        if "status" in request.data and response.status_code == 200:
            new_status = request.data["status"]

            if new_status != original_status:
                updated_order = self.get_object()

                # initialize supabase client and get email
                try:
                    url: str = config("SUPABASE_URL")
                    key: str = config("SUPABASE_SERVICE_KEY")
                    supabase: Client = create_client(url, key)

                    client_supabase_id = str(updated_order.client.supabase_id.id)
                    user_response = supabase.auth.admin.get_user_by_id(
                        client_supabase_id
                    )
                    client_email = user_response.user.email
                except Exception as e:
                    print(f"Could not get user email from Supabase, Errror: {e}")
                    return response
                try:
                    send_mail(
                        subject=f"Update on your order: {original_order.order_num}",
                        message=f"Hello, \n\nThe status of your service {original_order.service_type} has been updated to: {updated_order.get_status_display()} .\n\nThank you!",
                        from_email=config("EMAIL_HOST_USER"),
                        recipient_list=[client_email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Failed to send status update email. Error: {e}")

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
