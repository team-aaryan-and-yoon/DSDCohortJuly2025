from rest_framework.viewsets import ModelViewSet
from .models import Profile
from .serializers import ProfileSerializer
# from rest_framework.permissions import IsAuthenticated


class ProfileViewSet(ModelViewSet):
    serializer_class = ProfileSerializer
    # Uncomment to enable authentication
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Uncomment to enable authentication
        # user = self.request.user
        # if not user.is_authenticated:
        #     return Profile.objects.none()

        # return Profile.objects.filter(supabase_id=user.id)

        # For testing purposes, before we add auth
        return Profile.objects.all()
