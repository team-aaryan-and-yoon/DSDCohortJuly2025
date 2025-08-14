from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from decouple import config
from supabase import create_client
from utils.constants import get_display_status, Role
from users.models import Profile

import copy
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from utils.constants import ALL_SERVICES


@api_view(['GET'])
@permission_classes([AllowAny])
def get_services(request):
    """
    a view to get all services - accessible to anonymous users
    """
    services_data = copy.deepcopy(ALL_SERVICES)

    for service_category in services_data.values():
        for service in service_category:
            service["duration"] = str(service["duration"])

    return Response(services_data)




class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all().select_related("client", "provider")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "order_num"

    def perform_create(self, serializer):
        # Get the user's profile (attached by SupabaseAuth)
        profile = getattr(self.request, "profile", None)
        if not profile:
            # If no profile attached, try to get it from the user
            try:
                profile = Profile.objects.get(supabase_id=self.request.user)
            except Profile.DoesNotExist:
                raise ValueError("User profile not found")
        
        # Auto-assign a random provider based on service type
        service_type = serializer.validated_data.get('service_type')
        available_providers = Profile.objects.filter(
            role=Role.PROVIDER,
            provider_type=service_type
        )
        
        provider = None
        if available_providers.exists():
            provider = random.choice(available_providers)
        
        # Save the order with the client and assigned provider
        serializer.save(client=profile, provider=provider)

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
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # check for successful order creation
        if response.status_code == 201:
            try:
                order_data = response.data
                order = Order.objects.get(order_num=order_data["order_num"])
                self._send_order_confirmation_email(order)
            except Exception as e:
                pass
        return response
    
    def _send_order_confirmation_email(self, order):
        # helper to send confirmation email
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

            order_details = (
                f"Service Type: {order.service_type}\\n"
                f"Job: {order.job}\\n"
                f"Start Time: {order.start_time}\\n"
                f"End Time: {order.end_time}\\n"
                f"Status: {order.status}\\n"
                #f"Order Number: {order.order_num}\n  
            )

            if order.provider:
                provider_name = f"{order.provider.first_name} {order.provider.last_name}"
                provider_info = f"Your service will be provided by {provider_name}"
            else:
                provider_info = "A service provider will be assigned to your order shortly."

            #send email
            send_mail(
                subject=f"Confirmation of your order: {order.order_num}",
                message=(
                    f"Hello, \\n\\n"
                    f"Thank you for your order! Here are your order details:\\n\\n"
                    f"{order_details} \\n\\n"
                    f"{provider_info}\\n\\n"
                ),
                from_email=config("EMAIL_HOST_USER"),
                recipient_list=[client_email],
                fail_silently=False,
            )
        except Exception as e:
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

