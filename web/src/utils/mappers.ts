import type { Order, OrderView, ApiOrder } from "@/types/order";
import type { User, ApiUser } from "@/types/user";

// maps orders from API format to app format
export function mapOrderRequest(apiOrder: ApiOrder): Order {
  return {
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

// maps users from API format to app format
export function mapUserRequest(apiUser: ApiUser): User {
  return {
    email: apiUser.email,
    userNum: apiUser.user_num,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    role: apiUser.role,
    state: apiUser.state,
    streetAddress: apiUser.street_address,
    city: apiUser.city,
    zipCode: apiUser.zip_code,
  };
}

// maps app order format to a view format
export function mapOrderToView(order: Order): OrderView {
  const startDate = new Date(order.startTime);
  const orderDate = new Date(order.createdAt);
  return {
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
