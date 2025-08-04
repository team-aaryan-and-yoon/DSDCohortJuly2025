from ninja import NinjaAPI
from orders.views import router as orders_router


api = NinjaAPI(
    title="backend-api",
    description="API for team-aaryan-and-yoon project",
    version="1.0.0"
)

api.add_router("/orders", orders_router)


