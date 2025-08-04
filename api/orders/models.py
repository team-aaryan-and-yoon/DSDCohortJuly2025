from django.db import models
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator
import random
import string
from users.models import Profile


def generate_order_id(length=6):
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=length))


class Order(models.Model):
    SERVICE_TYPES = [
        ("cleaning", "Cleaning"),
        ("maintenance", "Maintenance"),
    ]

    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("on-the-way", "On the way"),
        ("in-progress", "In progress"),
        ("completed", "Completed"),
    ]

    SERVICE_DURATIONS = {
        "cleaning": timedelta(hours=2),
        "maintenance": timedelta(hours=3),
    }

    provider = models.ForeignKey(
       Profile, null=True, blank=True, related_name="provider_orders", on_delete=models.DO_NOTHING
    )

    client = models.ForeignKey(Profile, related_name="client_orders", on_delete=models.DO_NOTHING)

    order_num = models.CharField(max_length=6, unique=True)

    payment_token = models.CharField(max_length=50, blank=True, null=True)

    start_time = models.DateTimeField()

    # end_time is calculated based on start_time and service type duration
    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="scheduled"
    )

    service_type = models.CharField(
        max_length=20, choices=SERVICE_TYPES, default="cleaning"
    )

    comments = models.TextField(blank=True)

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_num:
            for attempt in range(5):
                self.order_num = generate_order_id()
                if not Order.objects.filter(order_num=self.order_num).exists():
                    break
            else:
                raise ValueError(
                    "Could not generate a unique order_num after 5 attempts."
                )
        duration = self.SERVICE_DURATIONS[self.service_type]
        self.end_time = self.start_time + duration
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_num} ({self.service_type}) for {self.client}"
