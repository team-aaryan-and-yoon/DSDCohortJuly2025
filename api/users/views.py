from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Profile, SupaUser
from .serializers import ProfileSerializer


class ProfileViewSet(ModelViewSet):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = Profile.objects.all()
        
        # Filter by supabase_id if provided
        supabase_id = self.request.query_params.get('supabase_id')
        if supabase_id:
            queryset = queryset.filter(supabase_id=supabase_id)
            
        return queryset
    
    def create(self, request):
        data = request.data.copy()
        
        if 'supabase_id' in data:
            email = data.get('email', '')
            supa_user, created = SupaUser.objects.get_or_create(
                id=data['supabase_id'],
                defaults={'email': email}
            )
            
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        supabase_uuid = data.get('supabase_id')
        if supabase_uuid:
            supa_user = SupaUser.objects.get(id=supabase_uuid)
            profile = serializer.save(supabase_id=supa_user)
        else:
            profile = serializer.save()
            
        return Response(serializer.data, status=201)
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        supabase_id = request.query_params.get('supabase_id')
        
        if supabase_id:
            if queryset.exists():
                profile = queryset.first()
                serializer = self.get_serializer(profile)
                return Response(serializer.data)
            else:
                return Response({"message": "User profile not found"}, status=404)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
