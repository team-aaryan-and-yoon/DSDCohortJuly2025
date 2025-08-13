import logging

from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from django.contrib.auth.models import AbstractBaseUser

from .models import Profile, SupaUser
from .serializers import ProfileSerializer
from .permissions import IsProfileOwner

logger = logging.getLogger(__name__)


class ProfileViewSet(ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, IsProfileOwner]

    def _get_supa(self):
        supa = getattr(self.request, "supa_user", None)
        if supa:
            return supa

        if isinstance(self.request.user, AbstractBaseUser):
            u = getattr(self.request.user, "username", "")
            if u.startswith("sb_"):
                return SupaUser.objects.get(id=u[3:])
        raise NotFound("No Supabase user on request")

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return Profile.objects.none()

        supa = getattr(self.request, "supa_user", None)
        if supa:
            qs = Profile.objects.filter(supabase_id_id=supa.id)
            logger.debug("profiles.get_queryset supa=%s count=%s", supa.id, qs.count())
            return qs

        u = getattr(self.request.user, "username", "")
        if u.startswith("sb_"):
            qs = Profile.objects.filter(supabase_id_id=u[3:])
            logger.debug("profiles.get_queryset fallback username=%s count=%s", u, qs.count())
            return qs

        return Profile.objects.none()

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        if qs.exists():
            return Response(self.get_serializer(qs.first()).data, status=200)
        return Response(None, status=204)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        supa = self._get_supa()

        existing = Profile.objects.filter(supabase_id=supa).first()
        if existing:
            return Response(self.get_serializer(existing).data, status=200)

        data = request.data.copy()
        data.pop("supabase_id", None)

        ser = self.get_serializer(data=data)
        ser.is_valid(raise_exception=True)
        profile = ser.save(supabase_id=supa)
        return Response(self.get_serializer(profile).data, status=201)

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_queryset().first()
        if not obj:
            raise NotFound("Profile not found")
        self.check_object_permissions(request, obj)
        return Response(self.get_serializer(obj).data)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        obj = self.get_queryset().first()
        if not obj:
            raise NotFound("Profile not found")
        self.check_object_permissions(request, obj)

        data = request.data.copy()
        data.pop("supabase_id", None)

        partial = kwargs.pop("partial", False)
        ser = self.get_serializer(obj, data=data, partial=partial)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

    partial_update = update

    def destroy(self, request, *args, **kwargs):
        obj = self.get_queryset().first()
        if not obj:
            raise NotFound("Profile not found")
        self.check_object_permissions(request, obj)
        obj.delete()
        return Response(status=204)
