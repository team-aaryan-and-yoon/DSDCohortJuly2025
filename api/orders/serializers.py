from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Order, Profile
from utils.constants import (
    PRICES,
    DESCRIPTIONS,
    ServiceType,
    CleaningJobs,
    MaintenanceJobs,
)


# MinimalProfileSerializer to avoid sending unnecessary provider data with orders
class MinimalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["first_name", "last_name", "user_num"]


class OrderSerializer(serializers.ModelSerializer):
    provider = MinimalProfileSerializer(read_only=True)
    client = MinimalProfileSerializer(read_only=True)
    price = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    @extend_schema_field(serializers.FloatField)
    def get_price(self, obj):
        return PRICES.get(obj.job, 0.0)

    @extend_schema_field(serializers.CharField)
    def get_description(self, obj):
        return DESCRIPTIONS.get(obj.job, "No description available.")

    def validate(self, data):
        service = data.get("service_type")
        job = data.get("job")
        if service and job:
            if service == ServiceType.CLEANING:
                valid_jobs = CleaningJobs.values
            elif service == ServiceType.MAINTENANCE:
                valid_jobs = MaintenanceJobs.values
            else:
                raise serializers.ValidationError("Invalid service type.")
            if job not in valid_jobs:
                raise serializers.ValidationError(
                    f"'{job}' is not valid for service '{service}'"
                )
        return data

    class Meta:
        model = Order
        fields = [
            "order_num",
            "provider",
            "client",
            "payment_token",
            "start_time",
            "end_time",
            "status",
            "service_type",
            "job",
            "comments",
            "rating",
            "created_at",
            "price",
            "description",
        ]
        read_only_fields = ["order_num", "start_time", "end_time", "created_at", "price", "description"]
