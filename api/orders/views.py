from ninja import Router
from .schemas import OrderStatusUpdate, OrderSchema
import uuid
from datetime import datetime
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from .models import Order, Profile

#new router instance
router = Router(tags=["Orders"])

@router.patch("/{order_id}/status", response=OrderSchema)

def update_order_status(request, order_id: uuid.UUID, payload: OrderStatusUpdate):
    """
    updates the status of a specific order and notifies via email
    """

    #fetch order from the database 
    order = get_object_or_404(Order, id=order_id)

    #update status from request payload
    order.status = payload.status
    order.save()


    #send email notifiacation
    client_email = order.client.email

    send_mail(
        subject=f"Update on your order: {order.order_num}",
        message=f"Hello, \n\n The status of your {order.service_type} service has ben updated to: {order.get_status_display()}. \n\nThank you!",
        from_email= "noreply@handsoff.com",
        recipient_list=[client_email],
        fail_silently=False,
    )


    static_order_data = {
        "id": order_id,
        "order_num": "FX45B2",
        #"client_id": uuid.uuid4(),
        "provider_id": uuid.uuid4(),
        "status": payload.status,       #we use the status sent in the request
        "service_type": "cleaning",
        "start_time": datetime.now(),
        "end_time": datetime.now() + timedelta(hours=2),
        "comments": "This is a static response from the API.",
        "rating": None,
    }
    return static_order_data
