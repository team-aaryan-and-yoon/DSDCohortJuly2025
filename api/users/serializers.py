from .models import Profile
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="supabase_id.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "user_num",
            "first_name",
            "last_name",
            "street_address",
            "city",
            "state",
            "zip_code",
            "email",
        ]
        read_only_fields = ["user_num", "email"]
