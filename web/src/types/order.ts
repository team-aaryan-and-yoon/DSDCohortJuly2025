import type { Status, ServiceType } from "./enums";

export interface Provider {
  firstName: string;
  lastName: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ApiProvider {
  first_name: string;
  last_name: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface Order {
  provider: Provider | null;
  client: Provider | null;
  orderNum: string;
  paymentToken: string | null;
  startTime: string;
  endTime: string;
  status: Status;
  serviceType: ServiceType;
  job: string;
  comments: string;
  rating: number | null;
  createdAt: string;
  price: number;
  description: string;
}

export interface OrderView {
  orderNum: string;
  providerName: string;
  serviceDate: string;
  serviceTime: string;
  serviceType: ServiceType;
  job: string;
  status: Status;
  rating: number | null;
  orderDate: string;
}

export interface ProviderOrderView {
  orderNum: string;
  clientName: string;
  serviceDate: string;
  serviceLocation: string;
  serviceTime: string;
  serviceType: ServiceType;
  job: string;
  status: Status;
  rating: number | null;
  orderDate: string;
  orderDetails?: string;
}

// Backend status format (lowercase with dashes)
export type BackendStatus =
  | "scheduled"
  | "on-the-way"
  | "in-progress"
  | "completed"
  | string; // Allow any string to avoid type errors, mapping will handle it

export interface ApiOrder {
  provider: ApiProvider | null;
  client: ApiProvider | null;
  order_num: string;
  payment_token: string | null;
  start_time: string;
  end_time: string;
  status: BackendStatus;
  service_type: ServiceType;
  job: string;
  comments: string;
  rating: number | null;
  created_at: string;
  price: number;
  description: string;
}
