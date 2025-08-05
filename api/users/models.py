from django.db import models
from random import choices
from string import ascii_uppercase, digits


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
    order_num = models.CharField(max_length=6, unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    street_address = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    supabase_id = models.OneToOneField(SupaUser, on_delete=models.CASCADE)
    # create api that uses email to connect supabaseid

    def __str__(self):
        return str(self.first_name + " " + self.last_name)

    def save(self, *args, **kwargs):
        if not self.order_num:
            for attempt in range(5):
                self.order_num = generate_user_num()
                if not Profile.objects.filter(user_num=self.user_num).exists():
                    break
            else:
                raise ValueError(
                    "Could not generate a unique user_num after 5 attempts."
                )
        super().save(*args, **kwargs)
