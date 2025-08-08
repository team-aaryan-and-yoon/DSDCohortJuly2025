from .models import Profile
from rest_framework import serializers
from utils.constants import Role


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="supabase_id.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "user_num",
            "first_name",
            "last_name",
            "role",
            "provider_type",
            "street_address",
            "city",
            "state",
            "zip_code",
            "email",
            "supabase_id",
        ]
        read_only_fields = ["user_num", "email"]

    def validate(self, data):
        role = data.get("role", getattr(self.instance, "role", None))
        provider_type = data.get(
            "provider_type", getattr(self.instance, "provider_type", None)
        )

        if role == Role.PROVIDER and not provider_type:
            raise serializers.ValidationError(
                {"provider_type": "Provider type is required for providers."}
            )
        if role != Role.PROVIDER and provider_type:
            raise serializers.ValidationError(
                {"provider_type": "Only providers can have a provider type."}
            )
        return data
