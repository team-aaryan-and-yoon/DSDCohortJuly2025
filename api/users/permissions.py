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
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
            
        # For list view, we'll filter in the viewset
        if view.action == 'list':
            return True
            
        # For create, always allow authenticated users to create their own profile
        if view.action == 'create':
            # The viewset will ensure they can only create their own profile
            return True
            
        return True
    
    def has_object_permission(self, request, view, obj):
        # Users can only access their own profile
        return obj.supabase_id == request.user