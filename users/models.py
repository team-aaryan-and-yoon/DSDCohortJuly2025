from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    """
    creating custom user model
    
    """
    class Role(models.TextChoices):
        CLIENT = 'CLIENT', 'Client'
        PROVIDER = 'PROVIDER', 'Provider'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        deafault=Role.CLIENT,
        help_text='User role, e.g., Client or Service Provider'
    )    

    #fields
    street_address = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.IntegerField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.username



