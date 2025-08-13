"""
Supabase JWT Authentication for Django REST Framework
"""
import jwt
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import authentication, exceptions

from .models import SupaUser, Profile

logger = logging.getLogger(__name__)
User = get_user_model()


class SupabaseAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class that validates Supabase JWT tokens.
    Extracts the user ID from the token and attaches the profile to the request.
    """
    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.replace("Bearer ", "", 1)

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError as e:
            raise exceptions.AuthenticationFailed(f"Invalid token: {e}")

        supa_id = payload.get("sub")
        email = (payload.get("email") or "").strip().lower()
        if not supa_id:
            raise exceptions.AuthenticationFailed("Invalid token: no user ID (sub)")

        with transaction.atomic():
            supa_user, _ = SupaUser.objects.get_or_create(
                id=supa_id, defaults={"email": email}
            )
            if email and supa_user.email != email:
                supa_user.email = email
                supa_user.save(update_fields=["email"])

            username = f"sb_{supa_id}"[:150]
            django_user, created = User.objects.get_or_create(
                username=username,
                defaults={"email": email, "is_active": True},
            )
            if created:
                try:
                    django_user.set_unusable_password()
                    django_user.save(update_fields=["password"])
                except Exception:
                    pass
            if email and django_user.email != email:
                django_user.email = email
                django_user.save(update_fields=["email"])

            request.supa_user = supa_user

            profile = Profile.objects.filter(supabase_id=supa_user).first()
            if not profile and email:
                stale = (
                    Profile.objects
                    .select_related("supabase_id")
                    .filter(supabase_id__email=email)
                    .first()
                )
                if stale and stale.supabase_id_id != supa_user.id:
                    stale.supabase_id = supa_user
                    stale.save(update_fields=["supabase_id"])
                    profile = stale
                    logger.info("Relinked Profile #%s from %s to %s via email=%s",
                                profile.id, stale.supabase_id_id, supa_user.id, email)

            request.profile = profile

        return (django_user, None)

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response.
        """
        return "Bearer"
