from rest_framework import permissions
from users.models import Profile


class IsProviderOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True
        
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return False
        

        #we'll need to add role (client, provider, maybe admin) to our Profile User Model
        return profile.role != Profile.Role.CLIENT