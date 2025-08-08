import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import ServiceOrderCard from "@/components/ServiceOrderCard";
import {
  mapOrderRequest,
  mapUserRequest,
  mapOrderToView,
} from "@/utils/mappers";
import type { Order } from "@/types/order";
import type { User, ApiUser } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

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

        // Fetch orders for the user
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select()
          .eq("client", authUser.id)
          .order();

        if (ordersError) {
          console.error("Error fetching orders", ordersError);
          setOrders([]);
          return;
        }

        const orders = (ordersData ?? []).map(mapOrderRequest);
        setOrders(orders);
      } catch (e) {
        console.error("Unexpected error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser]);

  if (loading) return <div>Loading...</div>;
  if (!authUser) return <div>Please log in to view your portal.</div>;

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
        {authUser.first_name
          ? `${authUser.first_name}!`
          : "Valued Customer!"}
      </h1>
      

      <section>
        <h2 className="text-xl font-bold mb-2">Current Orders</h2>
        <div className="flex flex-wrap gap-4">
          {current.length > 0 ? (
            current.map((order) => (
              <ServiceOrderCard key={order.id} order={mapOrderToView(order)} />
            ))
          ) : (
            <p>No current orders.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Upcoming Orders</h2>
        <div className="flex flex-wrapgap-4">
          {upcoming.length > 0 ? (
            upcoming.map((order) => (
              <ServiceOrderCard key={order.id} order={mapOrderToView(order)} />
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
                  <tr key={orderView.id}>
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
