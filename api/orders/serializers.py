from rest_framework import serializers
from .models import Order


# Going to need to grab some data from the User model as well so will need to import it
# Maybe could use a minimal serializer just to grab the first and last name of providers and nest it in the OrderSerializer
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "order_num",
            "client",
            "provider",
            "payment_token",
            "start_time",
            "end_time",
            "status",
            "service_type",
            "comments",
            "rating",
            "created_at",
        ]
        read_only_fields = ["order_num", "end_time", "created_at"]
