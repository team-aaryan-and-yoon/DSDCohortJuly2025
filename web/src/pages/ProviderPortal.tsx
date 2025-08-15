import AnnouncementCard from "@/components/AnnouncementCard";
import { FullCalendar, type CalendarEvent } from "@/components/FullSchedule";
import HourSchedule from "@/components/HourSchedule";
import RatingStars from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ProviderOrderView, type Order } from "@/types/order";
import type { Status } from "@/types/enums";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/apiClient";
import { mapOrderRequest, mapOrderToProviderView } from "@/utils/mappers";
import {
  mapFrontendToBackendStatus,
  mapBackendToFrontendStatus,
} from "@/utils/statusMapper";
import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";

const ProviderPortal = () => {
  const { user: authUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<ProviderOrderView[]>([]);
  const [history, setHistory] = useState<ProviderOrderView[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // Keep track of which specific order is currently being updated
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Process orders into different categories and formats needed for the UI
  const processOrders = (fetchedOrders: Order[]) => {
    if (fetchedOrders.length === 0) {
      setAnnouncements([]);
      setHistory([]);
      setEvents([]);
      return;
    }

    // Map orders to provider view format
    const providerOrders = fetchedOrders.map((order) =>
      mapOrderToProviderView(order)
    );

    // Helper function to check if a status is active
    const isActiveStatus = (status: string): boolean => {
      const activeStatuses = ["Scheduled", "On the way", "In progress"];
      return activeStatuses.some(
        (s) =>
          status === s || // Exact match
          status.toLowerCase() === s.toLowerCase() // Case insensitive match
      );
    };

    // Helper function to check if a status is completed
    const isCompletedStatus = (status: string): boolean => {
      return status === "Completed" || status.toLowerCase() === "completed";
    };

    // Filter for active orders (scheduled, on the way, in progress)
    const activeOrders = providerOrders.filter((order) =>
      isActiveStatus(order.status)
    );
    setAnnouncements(activeOrders);

    // Filter for completed orders (history)
    const completedOrders = providerOrders.filter((order) =>
      isCompletedStatus(order.status)
    );
    setHistory(completedOrders);

    // Create calendar events with properly formatted service type and job
    const calendarEvents: CalendarEvent[] = fetchedOrders
      .map((order) => {
        const startTime = new Date(order.startTime);
        const endTime = new Date(order.endTime);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          return null;
        }

        // Get the same formatting as used in the provider view by using
        // the same provider order object with the same ID
        const matchingProviderOrder = providerOrders.find(
          (providerOrder) => providerOrder.orderNum === order.orderNum
        );

        // If we found a matching provider order, use its formatted values
        const formattedServiceType = matchingProviderOrder
          ? matchingProviderOrder.serviceType
          : order.serviceType;
        const formattedJob = matchingProviderOrder
          ? matchingProviderOrder.job
          : order.job;

        return {
          id: order.orderNum,
          title: `${formattedServiceType} - ${formattedJob}`,
          start: startTime,
          end: endTime,
          color:
            order.serviceType.toLowerCase() === "cleaning"
              ? "#3b82f6"
              : "#ef4444",
          description: order.description || order.comments || "",
        };
      })
      .filter((event) => event !== null) as CalendarEvent[];

    setEvents(calendarEvents);
  };

  // Function to fetch orders from the API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      if (!authUser) {
        setAnnouncements([]);
        setHistory([]);
        setEvents([]);
        setLoading(false);
        return;
      }

      // Fetch orders for the provider from Django API with retry logic
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

      const fetchedOrders = (ordersData ?? []).map(mapOrderRequest);

      // Process orders for different views
      processOrders(fetchedOrders);
    } catch (e) {
      console.error("Unexpected error fetching provider orders", e);
      // Set empty arrays on error
      setAnnouncements([]);
      setHistory([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  // Handle status changes for orders
  const handleStatusChange = useCallback(
    async (orderNum: string, newStatus: Status) => {
      try {
        // Set the specific order that's being updated
        setUpdatingOrderId(orderNum);

        // Use the dedicated utility to convert frontend status to backend format
        const backendStatus = mapFrontendToBackendStatus(newStatus);

        // Make a direct PATCH request with the backend format status
        await apiClient.patch(`/orders/${orderNum}/`, {
          status: backendStatus, // Send backend format explicitly (lowercase with dashes)
        });

        // Verify the update with a GET request to ensure it was saved
        try {
          // Add a cache-busting parameter to ensure we get fresh data
          const verifyResponse = await apiClient.get(
            `orders/${orderNum}/?_=${new Date().getTime()}`
          );

          const currentStatus = verifyResponse.data?.status;

          // Use our status mapper to normalize both statuses for comparison
          const verifiedFrontendStatus =
            typeof currentStatus === "string"
              ? mapBackendToFrontendStatus(currentStatus)
              : "Scheduled";

          // Compare with what we expected
          if (verifiedFrontendStatus !== newStatus) {
            // If the status doesn't match what we expect, try one more update
            await apiClient.patch(`/orders/${orderNum}/`, {
              status: backendStatus,
            });
          }
        } catch {
          // Silent catch - still proceed with optimistic UI update
        }

        // Perform optimistic update on the local state regardless of verification

        // Update the specific order's status in the announcements array
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((order) => {
            if (order.orderNum === orderNum) {
              return {
                ...order,
                status: newStatus, // Update to the new status
              };
            }
            return order;
          })
        );

        // If the new status is "Completed", move the order to history
        if (newStatus === "Completed") {
          // Find the order to move
          const orderToMove = announcements.find(
            (order) => order.orderNum === orderNum
          );

          if (orderToMove) {
            // Update the order status
            const updatedOrder = {
              ...orderToMove,
              status: newStatus,
            };

            // Add to history
            setHistory((prevHistory) => [updatedOrder, ...prevHistory]);

            // Remove from announcements
            setAnnouncements((prevAnnouncements) =>
              prevAnnouncements.filter((order) => order.orderNum !== orderNum)
            );
          }
        }

        return true;
      } catch {
        // Silent error - we'll still try to update the UI

        // Even on error, try to optimistically update the UI
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((order) => {
            if (order.orderNum === orderNum) {
              return {
                ...order,
                status: newStatus,
              };
            }
            return order;
          })
        );

        return false;
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [announcements]
  );

  // Initial fetch on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  // Check if user is a provider
  // If not, redirect to customer portal
  if (authUser && authUser.role.toLowerCase() === "client") {
    return <Navigate to="/customer-portal" replace />;
  }

  return (
    <div className="w-full h-[100svh] px-4 py-8 overflow-hidden">
      <div className="flex w-full h-full gap-8 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col w-full h-full justify-between">
          <div className="w-full h-[48%] min-h-[48%] overflow-auto">
            <FullCalendar
              events={events}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onDayClick={(date) => {
                setSelectedDate(date);
              }}
            />
          </div>

          <div className="w-full h-[48%] min-h-[48%] border-4 rounded-lg overflow-hidden mt-4">
            {selectedDate ? (
              <HourSchedule
                events={events
                  .filter((event) => {
                    return (
                      event.start.toDateString() === selectedDate.toDateString()
                    );
                  })
                  .map((event) => ({
                    startTime: event.start.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    }),
                    endTime: event.end.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    }),
                    title: event.title,
                    description: event.description,
                  }))}
              />
            ) : (
              <div className="flex w-full justify-center items-center">
                <span className="font-light">
                  Select a date to see time scheduled
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Right */}
        <div className="flex w-full h-full gap-4">
          <div className="flex flex-col w-full h-full gap-4 ">
            {/* Announcement Panel */}
            <div className="flex flex-col h-2/3 w-full border-4 rounded-lg bg-white">
              <div className="flex w-full h-10 justify-center border-b-2 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-xl ">Announcements</label>
              </div>
              <div className="flex flex-col h-full w-full items-center gap-2 p-2 overflow-y-scroll">
                {announcements.length > 0 ? (
                  announcements.map((order, key) => (
                    <div
                      key={key}
                      className="flex w-full justify-center border-4 rounded-lg  bg-white">
                      <AnnouncementCard
                        order={order}
                        onStatusChange={handleStatusChange}
                        isLoading={updatingOrderId === order.orderNum}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex w-full h-full justify-center items-center">
                    <span> No active orders</span>
                  </div>
                )}
              </div>
            </div>
            {/* Control Panel */}
            <div className="flex flex-col h-1/3 w-full border-4 rounded-lg bg-gray-100">
              <div className="flex w-full h-10 justify-center border-b-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-xl">Control Panel</label>
              </div>
              <div className="flex w-full h-full justify-center items-center gap-4 p-4">
                <Button>Manage Profile</Button>
                <Button>Manage Payments</Button>
                <Button>Manage Schedule</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col h-full w-full border-4 rounded-lg bg-gray-100">
              <div className="flex w-full h-10 justify-center border-b-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <label className="font-bold text-xl ">History</label>
              </div>
              <div className="flex w-full h-full ">
                <Table className="bg-white border-2">
                  <TableHeader>
                    <TableRow className="sticky top-0 bg-gray-100 z-10">
                      <TableHead>Service</TableHead>
                      <TableHead className="border-l border-gray-300">
                        Job Type
                      </TableHead>
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
                    {history.map((data, key) => (
                      <TableRow key={key}>
                        <TableCell className="border-l border-gray-300">
                          {data.serviceType}
                        </TableCell>
                        <TableCell className="border-l border-gray-300">
                          {data.job}
                        </TableCell>
                        <TableCell className="border-l border-gray-300">
                          {data.serviceDate}
                        </TableCell>
                        <TableCell className="border-l border-gray-300">
                          {data.orderDate}
                        </TableCell>
                        <TableCell className="border-l border-gray-300">
                          {data.rating !== null && (
                            <RatingStars
                              value={data.rating}
                              orderId={data.orderNum}
                              readOnly={true}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPortal;
