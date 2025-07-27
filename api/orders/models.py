from django.db import models
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator

class Order(models.Model):
  SERVICE_TYPES = [
    ('cleaning', 'Cleaning'),
    ('maintenance', 'Maintenance'),
  ]

  STATUS_CHOICES = [
    ('scheduled', 'Scheduled'),
    ('on-the-way', 'On the Way'),
    ('in-progress', 'In Progress'),
    ('completed', 'Completed'),
  ]

  SERVICE_DURATIONS = {
    'cleaning': timedelta(hours=2),
    'maintenance': timedelta(hours=3),
  }

  provider = models.ForeignKey(
    'users.User',
    on_delete=models.CASCADE,
    related_name='provider_orders'
  )
  
  client = models.ForeignKey(
    'users.User',
    on_delete=models.CASCADE,
    related_name='client_orders'
  )

  order_num = models.CharField(max_length=50, unique=True)

  payment_token = models.CharField(max_length=50, blank=True, null=True)

  start_time = models.DateTimeField()

  # end_time is calculated based on start_time and service type duration
  end_time = models.DateTimeField(null=True, blank=True)
  
  status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default='scheduled'
  )

  service_type = models.CharField(
    max_length=20,
    choices=SERVICE_TYPES,
    default='cleaning'
  )

  comments = models.TextField(blank=True)

  rating = models.PositiveIntegerField(
    validators = [MinValueValidator(1), MaxValueValidator(5)],
    blank=True,
    null=True
  )

  created_at = models.DateTimeField(auto_now_add=True)

  updated_at = models.DateTimeField(auto_now=True)

  def save(self, *args, **kwargs):
    duration = self.SERVICE_DURATIONS[self.service_type]
    self.end_time = self.start_time + duration
    super().save(*args, **kwargs)
