from rest_framework import serializers
from .models import Order, Profile
from .utils.constants import PRICES, DESCRIPTIONS


# MinimalProfileSerializer to avoid sending unnecessary provider data with orders
class MinimalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["first_name", "last_name"]


class OrderSerializer(serializers.ModelSerializer):
    provider = MinimalProfileSerializer(read_only=True)
    price = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    def get_price(self, obj):
        return PRICES.get(obj.job, 0.0)

    def get_description(self, obj):
        return DESCRIPTIONS.get(obj.job, "No description available.")

    class Meta:
        model = Order
        fields = [
            "order_num",
            "provider",
            "payment_token",
            "start_time",
            "end_time",
            "status",
            "service_type",
            "comments",
            "rating",
            "created_at",
        ]
        read_only_fields = ["order_num", "start_time", "end_time", "created_at"]
