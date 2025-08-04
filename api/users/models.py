from django.db import models

# Create your models here.
class SupaUser(models.Model):
    id = models.UUIDField(primary_key=True) 

    class Meta:
        managed = False   
        db_table ='"auth"."users"' 

class Profile(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    street_address = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    supabase_id = models.OneToOneField(SupaUser, on_delete=models.CASCADE)
    # create api that uses email to connect supabaseid
    
    def __str__(self):
        return str(self.first_name +" "+self.last_name)