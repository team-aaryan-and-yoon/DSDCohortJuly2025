// import { createClient } from "@supabase/supabase-js";
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for testing purposes
import type { ApiOrder } from "@/types/order";

// Mock user object returned from auth.getUser()
const mockClient = {
  id: 123,
  email: "testuser@example.com",
  user_metadata: {
    first_name: "Matthew",
    last_name: "Sanner",
  },
};

// Example service providers
const mockProvider = {
  first_name: "John",
  last_name: "Doe",
};

const mockProvider2 = {
  first_name: "Jacob",
  last_name: "Doe",
};

// Seed data
const mockApiOrders: ApiOrder[] = [
  {
    id: 1,
    provider: mockProvider,
    client: 123,
    order_num: "ORD001",
    payment_token: null,
    start_time: "2025-07-20T14:00:00Z",
    end_time: "2025-07-20T15:00:00Z",
    status: "Completed",
    service_type: "Cleaning",
    comments: "Clean windows and floors",
    rating: 4,
    created_at: "2025-07-20T13:00:00Z",
  },
  {
    id: 2,
    provider: mockProvider2,
    client: 123,
    order_num: "ORD002",
    payment_token: null,
    start_time: "2025-07-22T16:00:00Z",
    end_time: "2025-07-22T17:00:00Z",
    status: "Completed",
    service_type: "Maintenance",
    comments: "Fix leaking faucet",
    rating: 5,
    created_at: "2025-07-22T15:00:00Z",
  },
  {
    id: 3,
    provider: mockProvider,
    client: 123,
    order_num: "ORD003",
    payment_token: null,
    start_time: "2025-07-24T10:00:00Z",
    end_time: "2025-07-24T11:00:00Z",
    status: "Completed",
    service_type: "Cleaning",
    comments: "Deep clean requested",
    rating: 5,
    created_at: "2025-07-24T09:00:00Z",
  },
  {
    id: 4,
    provider: mockProvider2,
    client: 123,
    order_num: "ORD004",
    payment_token: null,
    start_time: "2025-07-26T12:00:00Z",
    end_time: "2025-07-26T13:30:00Z",
    status: "Completed",
    service_type: "Maintenance",
    comments: "Fix cabinet door and check outlets",
    rating: 4,
    created_at: "2025-07-26T11:00:00Z",
  },
  {
    id: 5,
    provider: mockProvider,
    client: 123,
    order_num: "ORD005",
    payment_token: null,
    start_time: "2025-07-31T17:30:00Z",
    end_time: "2025-07-31T19:00:00Z",
    status: "In progress",
    service_type: "Cleaning",
    comments: "Focus on tile grout and bathroom fixtures",
    rating: null,
    created_at: "2025-07-31T17:00:00Z",
  },
  {
    id: 6,
    provider: mockProvider,
    client: 123,
    order_num: "ORD006",
    payment_token: null,
    start_time: "2025-08-01T14:00:00Z",
    end_time: "2025-08-01T15:30:00Z",
    status: "On the way",
    service_type: "Cleaning",
    comments: "Bring extra supplies for dusting",
    rating: null,
    created_at: "2025-08-01T13:00:00Z",
  },
  {
    id: 7,
    provider: mockProvider2,
    client: 123,
    order_num: "ORD007",
    payment_token: null,
    start_time: "2025-08-03T09:00:00Z",
    end_time: "2025-08-03T10:30:00Z",
    status: "On the way",
    service_type: "Maintenance",
    comments: "Replace broken tiles in kitchen",
    rating: null,
    created_at: "2025-08-02T15:00:00Z",
  },
  {
    id: 8,
    provider: mockProvider,
    client: 123,
    order_num: "ORD008",
    payment_token: null,
    start_time: "2025-08-05T12:00:00Z",
    end_time: "2025-08-05T13:00:00Z",
    status: "Scheduled",
    service_type: "Cleaning",
    comments: "Pet-friendly cleaning service requested",
    rating: null,
    created_at: "2025-08-04T12:00:00Z",
  },
];

// Mock Supabase client interface with minimal auth and query functionality

export const supabase = {
  auth: {
    // Simulates a successful call to supabase.auth.getUser()
    getUser: async () => ({ data: { user: mockClient }, error: null }),
  },
  from: (table: string) => {
    const queryBuilder = {
      // Mocks a filtered query
      eq: (column: keyof ApiOrder, value: ApiOrder[keyof ApiOrder]) => {
        return {
          order: () => {
            if (table === "orders") {
              const data = mockApiOrders.filter((o) => o[column] === value);
              return { data, error: null };
            }
            return { data: [], error: null };
          },
        };
      },
    };
    return {
      select: () => queryBuilder,
    };
  },
};
