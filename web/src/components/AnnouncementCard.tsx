import { useState } from "react";
import type { OrderView, ProviderOrderView } from "@/types/order";
import type { Status } from "@/types/enums";

import cleaningIcon from "@/assets/cleaning.png";
import maintenanceIcon from "@/assets/handyman.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AnnouncementProps {
  order: ProviderOrderView;
  onStatusChange?: (orderNum: string, newStatus: Status) => Promise<boolean>;
  isLoading?: boolean;
}

const orderIcons: Record<OrderView["serviceType"], string> = {
  Cleaning: cleaningIcon,
  Maintenance: maintenanceIcon,
};

// Define available status transitions based on current status
const nextStatuses: Record<Status, Status[]> = {
  Scheduled: ["On the way", "In progress", "Completed"],
  "On the way": ["In progress", "Completed"],
  "In progress": ["Completed"],
  Completed: [], // No further transitions available
};

const AnnouncementCard = ({
  order,
  onStatusChange,
  isLoading,
}: AnnouncementProps) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const icon = orderIcons[order.serviceType];

  // Use only the loading state from the parent
  const isDisabled = isLoading;

  const handleStatusChange = async (newStatus: Status) => {
    if (!onStatusChange) return;

    try {
      // Clear any previous status message
      setStatusMessage(null);

      // Call the parent handler to update the status
      // The parent will handle setting the loading state
      const success = await onStatusChange(order.orderNum, newStatus);

      if (success) {
        setMessageType("success");
        setStatusMessage(`Status updated to ${newStatus}`);
      } else {
        // Even if not explicitly failed, show waiting message
        setMessageType("success");
        setStatusMessage(`Status update sent, refreshing...`);
      }
    } catch {
      setMessageType("error");
      setStatusMessage("Status update failed. Please try again.");
    } finally {
      // Clear the message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-md border border-gray-100 mb-4 p-4">
      <div className="flex w-full h-auto">
        {/* Icon Image */}
        <div className="flex w-1/6 mr-2">
          <div className="flex justify-start items-center">
            <img
              src={icon}
              alt={`${order.serviceType} icon`}
              className="w-16 h-16 object-contain flex-shrink-0 rounded-md border border-gray-200"
            />
          </div>
        </div>

        {/* Order Details */}
        <div className="flex flex-col w-5/6 justify-center gap-1.5">
          <div className="flex justify-start">
            <span className="font-bold text-md text-gray-800">
              Customer:{" "}
              <span className="font-semibold">{order.clientName}</span>
            </span>
          </div>
          <div className="flex justify-start">
            <span className="text-md text-gray-700 font-medium">
              <span>{order.serviceType}</span> - {order.job}
            </span>
          </div>
          <div className="flex justify-start mt-0.5">
            <span className="text-sm text-gray-600">
              {order.serviceTime.replace(/^0/, "")} on {order.serviceDate}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="text-sm text-gray-600 truncate max-w-full">
              Address: {order.serviceLocation}
            </span>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-medium text-gray-700">Status:</span>
            <Select
              disabled={isDisabled || !onStatusChange}
              value={order.status}
              onValueChange={(value) => handleStatusChange(value as Status)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={order.status}>
                  {order.status} (Current)
                </SelectItem>
                {nextStatuses[order.status].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isLoading && (
              <span className="text-sm text-blue-500">Updating...</span>
            )}
            {statusMessage && !isLoading && (
              <div
                className={`text-sm ml-2 ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}>
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
