from .models import Profile
from rest_framework import serializers
from utils.constants import Role


class ProfileSerializer(serializers.ModelSerializer):
    """Full profile serializer for the authenticated user's own profile"""
    email = serializers.EmailField(source="supabase_id.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "user_num",
            "first_name",
            "last_name",
            "role",
            "provider_type",
            "street_address",
            "city",
            "state",
            "zip_code",
            "email",
            "supabase_id"
        ]
        read_only_fields = ["user_num", "email", "supabase_id"]

    def validate(self, data):
        role = data.get("role", getattr(self.instance, "role", None))
        provider_type = data.get(
            "provider_type", getattr(self.instance, "provider_type", None)
        )

        if role == Role.PROVIDER and not provider_type:
            raise serializers.ValidationError(
                {"provider_type": "Provider type is required for providers."}
            )
        if role != Role.PROVIDER and provider_type:
            raise serializers.ValidationError(
                {"provider_type": "Only providers can have a provider type."}
            )
        return data


class PublicProfileSerializer(serializers.ModelSerializer):
    """Limited profile info for public/provider views"""
    class Meta:
        model = Profile
        fields = [
            "user_num",
            "first_name",
            "role",
            "provider_type",
        ]
        read_only_fields = fields


from drf_stripe.stripe_api.customers import get_or_create_stripe_user
from drf_stripe.stripe_api.checkout import stripe_api_create_checkout_session
from drf_stripe.serializers import CheckoutRequestSerializer
from rest_framework.exceptions import ValidationError
from stripe.error import StripeError


class CustomCheckoutRequestSerializer(CheckoutRequestSerializer):
    """Handle creation of a custom checkout session where parameters are customized."""

    def validate(self, attrs):
        stripe_user = get_or_create_stripe_user(user_id=self.context['request'].user.id)
        try:
            checkout_session = stripe_api_create_checkout_session(
                customer_id=stripe_user.customer_id,
                line_items=[
                    {"price_id": "stripe_price_id", "quantity": 1}
                ],
                payment_method_types=["card", "alipay"],
                checkout_mode="payment")
            attrs['session_id'] = checkout_session['id']
        except StripeError as e:
            raise ValidationError(e.error)
        return attrs
