import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import ServiceOrderCard from "@/components/ServiceOrderCard";
import { mapOrderRequest, mapOrderToView } from "@/utils/mappers";
import type { Order } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const CustomerPortalPage = () => {
  const { user: authUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!authUser) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch orders for the user from Django API with retry logic
        let retries = 3;
        let response;

        while (retries > 0) {
          try {
            response = await apiClient.get("/orders/");
            break; // Success
          } catch (error) {
            retries--;
            if (retries === 0) {
              throw error; // Error if no retries left
            }
            // Wait 2 seconds before retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log(`Retrying API call... ${retries} attempts left`);
          }
        }

        const ordersData = response?.data;
        console.log("Raw API response:", ordersData);
        const orders = (ordersData ?? []).map(mapOrderRequest);
        setOrders(orders);
      } catch (e) {
        console.error("Unexpected error fetching orders", e);
        // Set empty orders array on error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser]);

  if (loading) return <div>Loading...</div>;
  if (!authUser) return <div>Please log in to view your portal.</div>;

  // If user is a provider, redirect to provider portal
  if (authUser && authUser.role.toLowerCase() === "provider") {
    return <Navigate to="/provider-portal" replace />;
  }

  // Filter orders into current, upcoming, and past categories
  const current = orders.filter(
    (o) => o.status === "In progress" || o.status === "On the way"
  );
  const upcoming = orders.filter((o) => o.status === "Scheduled");
  const past = orders.filter((o) => o.status === "Completed");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome,{" "}
        {authUser.first_name ? `${authUser.first_name}!` : "Valued Customer!"}
      </h1>

      <section>
        <h2 className="text-xl font-bold mb-2">Current Orders</h2>
        <div className="flex flex-wrap gap-4">
          {current.length > 0 ? (
            current.map((order) => (
              <ServiceOrderCard
                key={order.orderNum}
                order={mapOrderToView(order)}
              />
            ))
          ) : (
            <p>No current orders.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Upcoming Orders</h2>
        <div className="flex flex-wrap gap-4">
          {upcoming.length > 0 ? (
            upcoming.map((order) => (
              <ServiceOrderCard
                key={order.orderNum}
                order={mapOrderToView(order)}
              />
            ))
          ) : (
            <p>No upcoming orders.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Past Orders</h2>
        {past.length > 0 ? (
          <div className="overflow-x-auto m-6">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Service Type</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Service Date</th>
                  <th className="border px-4 py-2">Order Date</th>
                  <th className="border px-4 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {past.map(mapOrderToView).map((orderView) => (
                  <tr key={orderView.orderNum}>
                    <td className="border px-4 py-2">
                      {orderView.serviceType}
                    </td>
                    <td className="border px-4 py-2">{orderView.status}</td>
                    <td className="border px-4 py-2">
                      {orderView.serviceDate}
                    </td>
                    <td className="border px-4 py-2">{orderView.orderDate}</td>
                    <td className="border px-4 py-2">
                      {orderView.rating != null ? orderView.rating : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No past orders.</p>
        )}
      </section>
    </div>
  );
};

export default CustomerPortalPage;
