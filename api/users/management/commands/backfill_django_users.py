from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = "Create Django auth_user entries for existing Supabase users so drf_stripe can link to them."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for profile in Profile.objects.select_related("supabase_id"):
            supa_user = profile.supabase_id
            if not supa_user or not supa_user.id:
                self.stdout.write(self.style.WARNING(f"Profile {profile.id} has no Supabase user"))
                continue

            username = f"sb_{supa_user.id}"[:150]
            email = supa_user.email or ""

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
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created Django user for {email} ({username})"))
            else:
                if email and django_user.email != email:
                    django_user.email = email
                    django_user.save(update_fields=["email"])
                    updated_count += 1
                    self.stdout.write(self.style.NOTICE(f"Updated email for {username}"))

        self.stdout.write(self.style.SUCCESS(
            f"Backfill complete. Created {created_count}, updated {updated_count}."
        ))
