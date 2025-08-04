from ninja import Schema
from datetime import datetime
import uuid

class OrderStatusUpdate(Schema):
    status: str

class OrderSchema(Schema):
    id: uuid.UUID
    order_num: str
    #client_id: uuid.UUID
    provider_id: uuid.UUID = None
    status: str
    service_type: str
    start_time: datetime
    end_time: datetime
    comments: str = None
    rating: int = None
    
