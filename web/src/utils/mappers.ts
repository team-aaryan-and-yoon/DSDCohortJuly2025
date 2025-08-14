import type {
  Order,
  OrderView,
  ApiOrder,
  ProviderOrderView,
} from "@/types/order";
import type { User, ApiUser } from "@/types/user";
import { mapBackendToFrontendStatus } from "./statusMapper";

// maps orders from API format to app format
export function mapOrderRequest(apiOrder: ApiOrder): Order {
  try {
    const status = mapBackendToFrontendStatus(apiOrder.status as string);

    return {
      provider: apiOrder.provider
        ? {
            firstName: apiOrder.provider.first_name,
            lastName: apiOrder.provider.last_name,
            streetAddress: apiOrder.provider.street_address,
            city: apiOrder.provider.city,
            state: apiOrder.provider.state,
            zipCode: apiOrder.provider.zip_code,
          }
        : null,
      client: apiOrder.client
        ? {
            firstName: apiOrder.client.first_name,
            lastName: apiOrder.client.last_name,
            streetAddress: apiOrder.client.street_address,
            city: apiOrder.client.city,
            state: apiOrder.client.state,
            zipCode: apiOrder.client.zip_code,
          }
        : null,
      orderNum: apiOrder.order_num,
      paymentToken: apiOrder.payment_token,
      startTime: apiOrder.start_time,
      endTime: apiOrder.end_time,
      status: status,
      serviceType: apiOrder.service_type,
      job: apiOrder.job,
      comments: apiOrder.comments,
      rating: apiOrder.rating,
      createdAt: apiOrder.created_at,
      price: apiOrder.price,
      description: apiOrder.description,
    };
  } catch (error) {
    console.error("Error mapping order:", error, apiOrder);
    // Return a default order with Scheduled status in case of any mapping errors
    return {
      provider: null,
      client: null,
      orderNum: apiOrder.order_num || "unknown",
      paymentToken: null,
      startTime: apiOrder.start_time || new Date().toISOString(),
      endTime: apiOrder.end_time || new Date().toISOString(),
      status: "Scheduled", // Default frontend status value
      serviceType: apiOrder.service_type || "Cleaning",
      job: apiOrder.job || "Unknown",
      comments: apiOrder.comments || "",
      rating: null,
      createdAt: apiOrder.created_at || new Date().toISOString(),
      price: apiOrder.price || 0,
      description: apiOrder.description || "",
    };
  }
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
    orderNum: order.orderNum,
    providerName: order.provider
      ? `${order.provider.firstName} ${order.provider.lastName}`
      : "Your provider",
    serviceDate: startDate.toLocaleDateString(),
    serviceTime: startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    serviceType: order.serviceType,
    job: order.job,
    status: order.status,
    rating: order.rating,
    orderDate: orderDate.toLocaleDateString(),
  };
}

// maps app order format to a provider view format
export function mapOrderToProviderView(order: Order): ProviderOrderView {
  let startDate: Date;
  let orderDate: Date;

  try {
    startDate = new Date(order.startTime);
    if (isNaN(startDate.getTime())) {
      startDate = new Date(); // Fallback to current date
    }
  } catch {
    startDate = new Date(); // Fallback to current date
  }

  try {
    orderDate = new Date(order.createdAt);
    if (isNaN(orderDate.getTime())) {
      orderDate = new Date(); // Fallback to current date
    }
  } catch {
    orderDate = new Date(); // Fallback to current date
  }

  // Format client address if available
  let serviceLocation = "Client's Address";
  if (order.client && order.client.streetAddress) {
    const addressParts = [
      order.client.streetAddress,
      order.client.city,
      order.client.state,
      order.client.zipCode,
    ].filter(Boolean);

    serviceLocation = addressParts.join(", ");
  }

  return {
    orderNum: order.orderNum,
    clientName: order.client
      ? `${order.client.firstName} ${order.client.lastName}`
      : "Unknown Client",
    serviceDate: startDate.toLocaleDateString(),
    serviceTime: startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    serviceLocation: serviceLocation,
    serviceType: order.serviceType,
    job: order.job,
    status: order.status,
    rating: order.rating,
    orderDate: orderDate.toLocaleDateString(),
    orderDetails: order.description || order.comments || "",
  };
}
