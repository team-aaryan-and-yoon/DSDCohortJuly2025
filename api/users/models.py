from django.db import models
from random import choices
from string import ascii_uppercase, digits
from django.core.exceptions import ValidationError
from utils.constants import Role, ServiceType


def generate_user_num(length=6):
    chars = ascii_uppercase + digits
    return "".join(choices(chars, k=length))


class SupaUser(models.Model):
    id = models.UUIDField(primary_key=True)
    email = models.EmailField()

    class Meta:
        managed = False
        db_table = '"auth"."users"'


class Profile(models.Model):
    id = models.AutoField(primary_key=True)
    # remove blank and null later
    user_num = models.CharField(max_length=6, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    provider_type = models.CharField(
        max_length=20, choices=ServiceType.choices, blank=True, null=True
    )
    street_address = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    supabase_id = models.OneToOneField(SupaUser, on_delete=models.CASCADE)
    # create api that uses email to connect supabaseid

    def __str__(self):
        return f"{self.first_name or ''} {self.last_name or ''}".strip()

    def clean(self):
        super().clean()
        if self.role == Role.PROVIDER and not self.provider_type:
            raise ValidationError("Provider type is required for providers.")
        if self.role != Role.PROVIDER and self.provider_type:
            raise ValidationError("Only providers can have a provider type.")

    def save(self, *args, **kwargs):
        if not self.user_num:
            for attempt in range(5):
                self.user_num = generate_user_num()
                if not Profile.objects.filter(user_num=self.user_num).exists():
                    break
            else:
                raise ValueError(
                    "Could not generate a unique user_num after 5 attempts."
                )
        self.full_clean()
        super().save(*args, **kwargs)
