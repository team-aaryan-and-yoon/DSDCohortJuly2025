import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import cleaningIcon from "@/assets/cleaning.png";
import maintenanceIcon from "@/assets/handyman.png";
import type { OrderView } from "@/types/order";

interface ServiceOrderCardProps {
  order: OrderView;
}

const statusColors: Record<OrderView["status"], string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  "On the way": "bg-teal-100 text-teal-800",
  "In progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
};

const orderIcons: Record<OrderView["serviceType"], string> = {
  Cleaning: cleaningIcon,
  Maintenance: maintenanceIcon,
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
    <Card className="max-w-md w-full bg-white shadow-md rounded-xl border border-gray-200 py-2 m-6">
      <CardHeader className="text-center px-4 pt-4 pb-2 space-y-1">
        <h2 className="text-xl font-semibold text-gray-800">
          {order.serviceType}
        </h2>
        <span
          className={cn(
            "inline-block text-sm font-medium px-3 py-1 rounded-full",
            statusColors[order.status]
          )}>
          {order.status}
        </span>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-4">
          <img
            src={icon}
            alt={`${order.serviceType} icon`}
            className="w-16 h-16 object-contain flex-shrink-0"
          />
          <div className="bg-gray-100 p-3 rounded-lg text-center text-sm text-gray-800">
            <p className="text-base text-gray-800 leading-snug">
              {getStatusMessage(order)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCard;
