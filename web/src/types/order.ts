import type { Status, ServiceType } from "./enums";

export interface Provider {
  firstName: string;
  lastName: string;
}

export interface ApiProvider {
  first_name: string;
  last_name: string;
}

export interface Order {
  provider: Provider | null;
  orderNum: string;
  paymentToken: string | null;
  startTime: string;
  endTime: string;
  status: Status;
  serviceType: ServiceType;
  comments: string;
  rating: number | null;
  createdAt: string;
}

export interface OrderView {
  providerName: string;
  serviceDate: string;
  serviceTime: string;
  serviceType: ServiceType;
  status: Status;
  rating: number | null;
  orderDate: string;
}

export interface ProviderOrderView {
  id: number;
  clientName: string;
  serviceDate: string;
  serviceLocation: string;
  serviceTime: string;
  serviceType: ServiceType;
  status: Status;
  rating: number | null;
  orderDate: string;
}

export interface ApiOrder {
  provider: ApiProvider | null;
  order_num: string;
  payment_token: string | null;
  start_time: string;
  end_time: string;
  status: Status;
  service_type: ServiceType;
  comments: string;
  rating: number | null;
  created_at: string;
}
