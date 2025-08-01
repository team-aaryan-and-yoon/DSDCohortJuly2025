#from django.contrib.auth.models import AbstractUser
import uuid
from django.db import models


class User(models.Model):

    """
    creating custom user model
    
    """
    class Role(models.TextChoices):
        CLIENT = 'CLIENT', 'Client'
        CLEANING = 'CLEANING', 'Cleaning'
        MAINTENANCE = 'MAINTENANCE', 'Maintenance'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENT,
        help_text='User role, e.g., Client, Cleaning, Maintenance Provider'
    )    

    #fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #email = models.EmailField(unique=True)
    supabase_id = models.OneToOneField(unique=True, help_text="user unique ID from Supabase")
    street_address = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.supabase_id.username)


