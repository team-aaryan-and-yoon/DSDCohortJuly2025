from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from random import choices
from string import ascii_uppercase, digits
from users.models import Profile
from utils.constants import (
    ServiceType,
    StatusChoices,
    CleaningJobs,
    MaintenanceJobs,
    DURATIONS,
)


def generate_order_num(length=6):
    chars = ascii_uppercase + digits
    return "".join(choices(chars, k=length))


class Order(models.Model):
    id = models.AutoField(primary_key=True)

    order_num = models.CharField(max_length=6, unique=True)

    provider = models.ForeignKey(
        Profile,
        null=True,
        blank=True,
        related_name="provider_orders",
        on_delete=models.SET_NULL,
    )

    client = models.ForeignKey(
        Profile,
        blank=True,
        null=True,
        related_name="client_orders",
        on_delete=models.SET_NULL,
    )

    payment_token = models.CharField(max_length=50, blank=True, null=True)

    start_time = models.DateTimeField()

    # end_time is calculated based on start_time and service type duration
    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20, choices=StatusChoices.choices, default=StatusChoices.SCHEDULED
    )

    service_type = models.CharField(max_length=20, choices=ServiceType.choices)

    job = models.CharField(max_length=30)

    comments = models.TextField(blank=True)

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # Validate that job is valid for the given service_type
        if not self.service_type or not self.job:
            return
        if not self.client:
            raise ValidationError("Orders must be associated with a client.")

        if self.service_type == ServiceType.CLEANING:
            valid_jobs = CleaningJobs.values
        elif self.service_type == ServiceType.MAINTENANCE:
            valid_jobs = MaintenanceJobs.values
        else:
            raise ValidationError("Invalid service_type")

        if self.job not in valid_jobs:
            raise ValidationError(
                f"Job '{self.job}' is not valid for service_type '{self.service_type}'"
            )

        if self.job not in DURATIONS:
            raise ValidationError(f"No duration defined for job '{self.job}'")

    def save(self, *args, **kwargs):
        # generate unique order_num if not set
        if not self.order_num:
            for attempt in range(5):
                self.order_num = generate_order_num()
                if not Order.objects.filter(order_num=self.order_num).exists():
                    break
            else:
                raise ValueError(
                    "Could not generate a unique order_num after 5 attempts."
                )

        # Calculate end_time based on start_time and job duration
        if self.start_time and self.job:
            self.end_time = self.start_time + DURATIONS[self.job]

        self.full_clean()  # Call clean method to validate job and service_type

        super().save(*args, **kwargs)

    def __str__(self):
        if self.client:
            client_name = (
                f"{self.client.first_name or ''} {self.client.last_name or ''}".strip()
            )
        else:
            client_name = "Unassigned"
        return f"Order {self.order_num}, {self.service_type} - {self.job} for {client_name}"
