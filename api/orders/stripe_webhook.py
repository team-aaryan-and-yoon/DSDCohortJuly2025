import stripe
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from users.models import Profile
from datetime import datetime, timedelta
from utils.constants import DURATIONS
import logging

logger = logging.getLogger(__name__)

stripe.api_key = settings.DRF_STRIPE['STRIPE_API_SECRET']

@csrf_exempt
@require_POST
def stripe_webhook(request):
    """
    Handle Stripe webhooks, specifically checkout.session.completed events
    to create orders when payment succeeds.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        # Verify webhook signature (you'll need to set STRIPE_WEBHOOK_SECRET)
        # event = stripe.Webhook.construct_event(
        #     payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        # )
        
        # For now, just parse the payload directly (not recommended for production)
        event = json.loads(payload)
        
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Webhook signature verification failed: {e}")
        return HttpResponse(status=400)
    
    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        try:
            # Extract metadata from the session
            metadata = session.get('metadata', {})
            service_type = metadata.get('service_type')
            job = metadata.get('job')
            start_time_str = metadata.get('start_time')
            comments = metadata.get('comments', '')
            service_name = metadata.get('service_name')
            
            if not all([service_type, job, start_time_str]):
                logger.error(f"Missing required metadata in session {session['id']}")
                return HttpResponse(status=400)
            
            # Parse start time
            start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
            
            # Calculate end time using job duration
            if job in DURATIONS:
                end_time = start_time + DURATIONS[job]
            else:
                # Default to 2 hours if duration not found
                end_time = start_time + timedelta(hours=2)
            
            # Get customer email from session and find corresponding profile
            customer_email = session.get('customer_details', {}).get('email')
            if not customer_email:
                logger.error(f"No customer email found in session {session['id']}")
                return HttpResponse(status=400)
            
            # Find the client profile by email (you might need to adjust this based on your auth system)
            try:
                # This assumes you have a way to map Stripe customer email to your Profile
                # You might need to adjust this based on how your auth system works
                client_profile = Profile.objects.filter(
                    # Add the appropriate filter based on your Profile model
                    # For example, if you store email in Profile:
                    # email=customer_email
                ).first()
                
                if not client_profile:
                    logger.error(f"No client profile found for email {customer_email}")
                    return HttpResponse(status=400)
                
            except Exception as e:
                logger.error(f"Error finding client profile: {e}")
                return HttpResponse(status=400)
            
            # Create the order
            order = Order.objects.create(
                client=client_profile,
                payment_token=session['id'],  # Store Stripe session ID
                start_time=start_time,
                end_time=end_time,
                service_type=service_type,
                job=job,
                comments=comments,
                status='scheduled'  # or whatever your default status is
            )
            
            logger.info(f"Order {order.order_num} created for session {session['id']}")
            
        except Exception as e:
            logger.error(f"Error creating order for session {session['id']}: {e}")
            return HttpResponse(status=500)
    
    return HttpResponse(status=200)