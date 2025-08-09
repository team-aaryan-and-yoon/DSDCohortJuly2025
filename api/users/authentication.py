"""
Supabase JWT Authentication for Django REST Framework
"""
import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import Profile, SupaUser


class SupabaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class that validates Supabase JWT tokens.
    Extracts the user ID from the token and attaches the profile to the request.
    """
    
    def authenticate(self, request):
        # Get the Authorization header
        auth_header = authentication.get_authorization_header(request).decode('utf-8')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        # Extract the token
        token = auth_header.replace('Bearer ', '')
        
        try:
            # Decode and verify the JWT token using Supabase's JWT secret
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=['HS256'],
                options={"verify_aud": False}  # Supabase doesn't use audience claim
            )
            
            # Extract the user ID from the token
            user_id = payload.get('sub')
            if not user_id:
                raise exceptions.AuthenticationFailed('Invalid token: no user ID')
            
            # Get or create the SupaUser
            supa_user, _ = SupaUser.objects.get_or_create(
                id=user_id,
                defaults={'email': payload.get('email', '')}
            )
            
            # Try to get the profile
            try:
                profile = Profile.objects.get(supabase_id=supa_user)
                # Attach the profile to the request for easy access
                request.profile = profile
            except Profile.DoesNotExist:
                # User is authenticated but has no profile yet
                request.profile = None
            
            # Return the SupaUser and None (no auth object needed)
            return (supa_user, None)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication error: {str(e)}')
    
    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response.
        """
        return 'Bearer'