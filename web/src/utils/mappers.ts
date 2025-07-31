import type { Order, OrderView, ApiOrder } from "@/types/order";
import type { User, ApiUser } from "@/types/user";

export function mapOrder(apiOrder: ApiOrder): Order {
  return {
    id: apiOrder.id,
    provider: apiOrder.provider
      ? {
          firstName: apiOrder.provider.first_name,
          lastName: apiOrder.provider.last_name,
        }
      : null,
    client: apiOrder.client,
    orderNum: apiOrder.order_num,
    paymentToken: apiOrder.payment_token,
    startTime: apiOrder.start_time,
    endTime: apiOrder.end_time,
    status: apiOrder.status,
    serviceType: apiOrder.service_type,
    comments: apiOrder.comments,
    rating: apiOrder.rating,
    createdAt: apiOrder.created_at,
  };
}

export function mapUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.user_metadata.first_name,
    lastName: apiUser.user_metadata.last_name,
    role: apiUser.user_metadata.role,
    state: apiUser.user_metadata.state,
    streetAddress: apiUser.user_metadata.street_address,
    city: apiUser.user_metadata.city,
    zipCode: apiUser.user_metadata.zip_code,
  };
}

export function mapOrderToView(order: Order): OrderView {
  const startDate = new Date(order.startTime);
  const orderDate = new Date(order.createdAt);
  return {
    id: order.id,
    providerName: order.provider
      ? `${order.provider.firstName} ${order.provider.lastName}`
      : "Your provider",
    serviceDate: startDate.toLocaleDateString(),
    serviceTime: startDate.toLocaleTimeString(),
    serviceType: order.serviceType,
    status: order.status,
    rating: order.rating,
    orderDate: orderDate.toLocaleDateString(),
  };
}
