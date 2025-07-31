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
  id: number;
  provider: Provider | null;
  client: number;
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
  id: number;
  providerName: string;
  serviceDate: string;
  serviceTime: string;
  serviceType: ServiceType;
  status: Status;
  rating: number | null;
  orderDate: string;
}

export interface ApiOrder {
  id: number;
  provider: ApiProvider | null;
  client: number;
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
