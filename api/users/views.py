from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile, SupaUser
from .serializers import ProfileSerializer
from .permissions import IsProfileOwner


class ProfileViewSet(ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsProfileOwner]

    def get_queryset(self):
        # Users can only see their own profile
        if not self.request.user.is_authenticated:
            return Profile.objects.none()
        
        # Filter to only the authenticated user's profile
        return Profile.objects.filter(supabase_id=self.request.user)
    
    def create(self, request):
        # Check if profile already exists for this user
        try:
            existing_profile = Profile.objects.get(supabase_id__id=request.user.id)
            # Profile already exists, return it
            serializer = self.get_serializer(existing_profile)
            return Response(serializer.data, status=200)
        except Profile.DoesNotExist:
            pass  # Continue with creation
        
        data = request.data.copy()
        
        # Ensure the supabase_id matches the authenticated user
        data['supabase_id'] = str(request.user.id)
        
        # Get or create the SupaUser
        email = data.get('email', getattr(request.user, 'email', ''))
        supa_user, created = SupaUser.objects.get_or_create(
            id=request.user.id,
            defaults={'email': email}
        )
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Save with the authenticated user's SupaUser instance
        profile = serializer.save(supabase_id=supa_user)
            
        return Response(serializer.data, status=201)
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        # For authenticated users, return their profile if it exists
        if queryset.exists():
            profile = queryset.first()
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        else:
            # Return empty response with 204 No Content for missing profile
            # This indicates success but no profile exists yet
            return Response(None, status=204)
