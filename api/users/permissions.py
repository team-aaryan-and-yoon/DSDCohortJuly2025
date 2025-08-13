"""
Custom permissions for user profiles
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a profile to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Write permissions are only allowed to the owner of the profile
        return obj.supabase_id == request.user


class IsProfileOwner(permissions.BasePermission):
    """
    Permission that only allows users to access their own profile.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if view.action in ("list", "create"):
            return True

        return True

    def has_object_permission(self, request, view, obj):
        supa = getattr(request, "supa_user", None)
        return bool(supa and obj.supabase_id_id == supa.id)
