from rest_framework.viewsets import ModelViewSet
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated


class ProfileViewSet(ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Profile.objects.none()

        return Profile.objects.filter(supabase_id=user.id)
