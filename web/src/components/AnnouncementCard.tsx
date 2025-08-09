import type { OrderView, ProviderOrderView } from "@/types/order";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import cleaningIcon from "@/assets/cleaning.png";
import maintenanceIcon from "@/assets/handyman.png";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface AnouncementProps {
    order: ProviderOrderView
}

const orderIcons: Record<OrderView["serviceType"], string> = {
  Cleaning: cleaningIcon,
  Maintenance: maintenanceIcon,
};

const AnnouncementCard = ({order}: AnouncementProps) => {
    const icon = orderIcons[order.serviceType];
    return (
       <Collapsible className="w-full h-full">
        {/* header */}
        <CollapsibleTrigger className="w-full">
        <div className="flex w-full h-full">
            {/* Icon Image */}
            <div className="flex w-1/4 h-full">
                <div className="flex w-full justify-start items-center p-2">
                    <img
                    src={icon}
                    alt={`${order.serviceType} icon`}
                    className="w-16 h-16 object-contain flex-shrink-0"
                    />
                </div>
            </div>
            {/* Summary */}
            <div className="flex w-3/4 h-20 items-center">
                <Label className="font-bold text-md"> {order.serviceType} at {order.serviceTime} on {order.serviceLocation}</Label>
            </div>
        </div>
        </CollapsibleTrigger>
            <CollapsibleContent className="w-full">
            <div className="flex flex-col w-full h-full">
                <div className="w-full p-2">Client: {order.clientName}</div>
                <div className="flex w-full justify-end gap-2 p-4">
                    <Button variant={"destructive"}>Remove</Button>
                    <Button>Contact</Button>
                </div>
            </div>
            </CollapsibleContent>
       </Collapsible>
    );
}

export default AnnouncementCard;