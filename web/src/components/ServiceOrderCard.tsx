import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import cleaningIcon from "@/assets/cleaning.png";
import maintenanceIcon from "@/assets/handyman.png";
import type { OrderView } from "@/types/order";

interface ServiceOrderCardProps {
  order: OrderView;
}

const statusColors: Record<OrderView["status"], string> = {
  Scheduled: "bg-blue-200 text-blue-800",
  "On the way": "bg-teal-200 text-teal-800",
  "In progress": "bg-yellow-200 text-yellow-800",
  Completed: "bg-green-200 text-green-800",
};

const orderIcons: Record<string, string> = {
  cleaning: cleaningIcon,
  maintenance: maintenanceIcon,
  Cleaning: cleaningIcon,  // Keep capitalized version for backward compatibility
  Maintenance: maintenanceIcon,  // Keep capitalized version for backward compatibility
};

const getStatusMessage = (order: OrderView) => {
  switch (order.status) {
    case "Scheduled":
    case "On the way":
      return (
        <>
          <span className="font-semibold">{order.providerName}</span> is
          arriving on <span className="font-semibold">{order.serviceDate}</span>{" "}
          at <span className="font-semibold">{order.serviceTime}</span>.
        </>
      );
    case "In progress":
      return (
        <>
          <span className="font-semibold">{order.providerName}</span> is
          currently working on this service.
        </>
      );
    // case "Completed":
    //   return (
    //     <>
    //       This service was completed by{" "}
    //       <span className="font-semibold">{order.providerName}</span> on{" "}
    //       <span className="font-semibold">{order.serviceDate}</span>.
    //     </>
    //   );
    default:
      return null;
  }
};

const ServiceOrderCard = ({ order }: ServiceOrderCardProps) => {
  const icon = orderIcons[order.serviceType];

  return (
    <Card className="w-full bg-white shadow-md rounded-lg border-2 border-gray-300 py-1 gap-2">
      <CardHeader className="text-center px-4 py-2 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 truncate max-w-[70%]">
            {order.serviceType}
            {order.job && <span className="font-normal"> - {order.job}</span>}
          </h2>
          <span
            className={cn(
              "inline-block text-sm font-medium px-3 py-1 rounded-full",
              statusColors[order.status]
            )}>
            {order.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 pt-0">
        <div className="flex items-start gap-3">
          <img
            src={icon}
            alt={`${order.serviceType} icon`}
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="bg-gray-50 p-2 rounded-lg text-gray-800 flex-grow">
            <p className="text-base text-gray-800 leading-snug">
              {getStatusMessage(order)}
            </p>
            <div className="mt-1 text-sm text-gray-500 flex justify-between">
              <div>Order #: {order.orderNum}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCard;
