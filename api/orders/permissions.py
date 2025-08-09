from rest_framework import permissions
from users.models import Profile
from utils.constants import Role


class IsProviderOrAdmin(permissions.BasePermission):
    """
    custom perms to allow providers to edit an order
    clients are denied access
    """

    message = "You do not have permission to perform this action."
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
        return profile.role != Role.CLIENT