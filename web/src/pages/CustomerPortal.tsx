import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import ServiceOrderCard from "@/components/ServiceOrderCard";
import { mapOrderRequest, mapOrderToView } from "@/utils/mappers";
import type { Order } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import RatingStars from "@/components/RatingStars";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          }
        }

        const ordersData = response?.data;
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

  if (loading)
    return (
      <div className="w-full h-[100svh] flex items-center justify-center">
        Loading...
      </div>
    );
  if (!authUser)
    return (
      <div className="w-full h-[100svh] flex items-center justify-center">
        Please log in to view your portal.
      </div>
    );

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
    <div className="w-full h-[100svh] px-4 py-4 overflow-hidden">
      <div className="w-full h-full flex flex-col gap-3">
        <h1 className="text-2xl font-bold">
          Welcome,{" "}
          {authUser.first_name ? `${authUser.first_name}!` : "Valued Customer!"}
        </h1>

        <div className="flex flex-col lg:flex-row w-full h-full gap-4 overflow-hidden">
          {/* Left side - Current and Upcoming Orders */}
          <div className="flex flex-col w-full lg:w-2/3 h-full gap-4">
            {/* Current Orders */}
            <div className="flex flex-col h-1/2 w-full border-4 rounded-lg bg-white">
              <div className="flex w-full h-8 justify-center border-b-2 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-lg">Current Orders</label>
              </div>
              <div className="flex flex-col h-full w-full items-center gap-2 p-2 overflow-y-auto">
                {current.length > 0 ? (
                  current.map((order) => (
                    <div key={order.orderNum} className="flex w-full">
                      <ServiceOrderCard
                        key={order.orderNum}
                        order={mapOrderToView(order)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex w-full h-full justify-center items-center">
                    <span>No current orders</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Orders */}
            <div className="flex flex-col h-1/2 w-full border-4 rounded-lg bg-white">
              <div className="flex w-full h-8 justify-center border-b-2 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-lg">Upcoming Orders</label>
              </div>
              <div className="flex flex-col h-full w-full items-center gap-2 p-2 overflow-y-auto">
                {upcoming.length > 0 ? (
                  upcoming.map((order) => (
                    <div key={order.orderNum} className="flex w-full">
                      <ServiceOrderCard
                        key={order.orderNum}
                        order={mapOrderToView(order)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex w-full h-full justify-center items-center">
                    <span>No upcoming orders</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Past Orders */}
          <div className="flex flex-col w-full lg:w-1/3 h-full">
            <div className="flex flex-col h-full w-full border-4 rounded-lg bg-white">
              <div className="flex w-full h-8 justify-center border-b-2 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-lg">Order History</label>
              </div>
              <div className="flex w-full h-full overflow-auto">
                {past.length > 0 ? (
                  <Table className="bg-white">
                    <TableHeader>
                      <TableRow className="sticky top-0 bg-gray-100 z-10">
                        <TableHead>Order #</TableHead>
                        <TableHead className="border-l border-gray-300">Service Type</TableHead>
                        <TableHead className="border-l border-gray-300">
                          Service Date
                        </TableHead>
                        <TableHead className="border-l border-gray-300">
                          Order Date
                        </TableHead>
                        <TableHead className="border-l border-gray-300">
                          Rating
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {past.map(mapOrderToView).map((orderView) => (
                        <TableRow key={orderView.orderNum}>
                          <TableCell>
                            {orderView.orderNum}
                          </TableCell>
                          <TableCell className="border-l border-gray-300">
                            {orderView.serviceType}
                          </TableCell>
                          <TableCell className="border-l border-gray-300">
                            {orderView.serviceDate}
                          </TableCell>
                          <TableCell className="border-l border-gray-300">
                            {orderView.orderDate}
                          </TableCell>
                          <TableCell className="border-l border-gray-300">
                            <RatingStars
                              value={orderView.rating}
                              orderId={orderView.orderNum}
                              readOnly={orderView.rating !== null}
                              onRatingUpdate={(newRating) => {
                                // Update orders array with the new rating
                                setOrders((prevOrders) =>
                                  prevOrders.map((order) =>
                                    order.orderNum === orderView.orderNum
                                      ? { ...order, rating: newRating }
                                      : order
                                  )
                                );
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex w-full h-full justify-center items-center">
                    <span>No past orders</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortalPage;
