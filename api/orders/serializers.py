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
        fields = ["first_name", "last_name"]


class OrderSerializer(serializers.ModelSerializer):
    provider = MinimalProfileSerializer(read_only=True)
    price = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    service_type = serializers.SerializerMethodField()

    @extend_schema_field(serializers.FloatField)
    def get_price(self, obj):
        return PRICES.get(obj.job, 0.0)

    @extend_schema_field(serializers.CharField)
    def get_description(self, obj):
        return DESCRIPTIONS.get(obj.job, "No description available.")

    @extend_schema_field(serializers.CharField)
    def get_status(self, obj):
        status_mapping = {
            "scheduled": "Scheduled",
            "on-the-way": "On the way",
            "in-progress": "In progress",
            "completed": "Completed",
        }
        return status_mapping.get(obj.status, obj.status)

    @extend_schema_field(serializers.CharField)
    def get_service_type(self, obj):
        service_mapping = {"cleaning": "Cleaning", "maintenance": "Maintenance"}
        return service_mapping.get(obj.service_type, obj.service_type)

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
        read_only_fields = [
            "order_num",
            "start_time",
            "end_time",
            "created_at",
            "price",
            "description",
            "status",
            "service_type",
        ]
