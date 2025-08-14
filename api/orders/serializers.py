from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Order, Profile
from utils.constants import (
    PRICES,
    DESCRIPTIONS,
    ServiceType,
    CleaningJobs,
    MaintenanceJobs,
    get_display_status,
    get_backend_status,
)


# MinimalProfileSerializer to avoid sending unnecessary user data with orders
class MinimalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "street_address",
            "city",
            "state",
            "zip_code",
        ]


class OrderSerializer(serializers.ModelSerializer):
    provider = MinimalProfileSerializer(read_only=True)
    client = MinimalProfileSerializer(read_only=True)
    price = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    status = serializers.CharField()
    service_type = serializers.ChoiceField(choices=ServiceType.choices, write_only=False)
    job = serializers.CharField(write_only=False)
    start_time = serializers.DateTimeField(write_only=False)
    service_type_display = serializers.SerializerMethodField(read_only=True)
    job_display = serializers.SerializerMethodField(read_only=True)

    @extend_schema_field(serializers.FloatField)
    def get_price(self, obj):
        return PRICES.get(obj.job, 0.0)

    @extend_schema_field(serializers.CharField)
    def get_description(self, obj):
        return DESCRIPTIONS.get(obj.job, "No description available.")

    # Override to_representation to convert status to frontend format when sending to client
    def to_representation(self, instance):
        ret = super().to_representation(instance)

        # Convert status from backend to frontend format using our utility function
        ret["status"] = get_display_status(instance.status)

        return ret

    def update(self, instance, validated_data):
        # Handle status updates explicitly
        if "status" in validated_data:
            new_status = validated_data.pop("status")

            # Convert to backend format using our utility function
            db_status = get_backend_status(new_status)

            from django.db import transaction

            try:
                with transaction.atomic():
                    # Update status directly in the database
                    instance.status = db_status
                    instance.save(update_fields=["status"])

                    # Refresh from DB to confirm change
                    instance.refresh_from_db()
            except Exception:
                raise

        # Process other fields normally
        return super().update(instance, validated_data)

    @extend_schema_field(serializers.CharField)
    def get_service_type_display(self, obj):
        service_mapping = {"cleaning": "Cleaning", "maintenance": "Maintenance"}
        return service_mapping.get(obj.service_type, obj.service_type)

    @extend_schema_field(serializers.CharField)
    def get_job_display(self, obj):
        # Create a combined mapping dictionary from both CleaningJobs and MaintenanceJobs choices
        job_mapping = {}

        # Add cleaning job choices
        for value, label in CleaningJobs.choices:
            job_mapping[value] = label

        # Add maintenance job choices
        for value, label in MaintenanceJobs.choices:
            job_mapping[value] = label

        # Return the display name from the mapping
        return job_mapping.get(obj.job, obj.job)

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

        # Validate status field if present
        if "status" in data:
            status = data.get("status")
            from utils.constants import StatusChoices

            valid_statuses = [status_value for status_value, _ in StatusChoices.choices]

            # Convert frontend format to backend format if needed
            db_status = get_backend_status(status)
            data["status"] = db_status

            # Check if the backend status is valid
            if db_status not in valid_statuses:
                # Invalid status
                raise serializers.ValidationError(
                    f"Invalid status: '{status}'. Valid options are: {', '.join(dict(StatusChoices.choices).values())}"
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
            "service_type_display",
            "job_display",
            "comments",
            "rating",
            "created_at",
            "price",
            "description",
        ]
        # IMPORTANT: 'status' is NOT in read_only_fields to allow status updates
        read_only_fields = [
            "order_num",
            "end_time",
            "created_at",
            "price",
            "description",
            "service_type_display",
            "job_display",
        ]
