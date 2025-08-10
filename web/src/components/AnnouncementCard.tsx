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
       <Collapsible className="w-full h-full bg-gray-50 rounded-sm">
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
            <div className="flex flex-col w-3/4 h-20 justify-center ">
                <div className="flex justify-start">
                    <Label className="font-bold text-md">{order.clientName}</Label>
                </div>
                <div className="flex justify-start items-center ">
                <Label className="font-bold text-md"> {order.serviceType} at {order.serviceTime} on {order.serviceLocation}</Label>
                </div>
            </div>
            
        </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full p-2 ">
            <div className="flex flex-col w-full h-full border-2 p-4 rounded-lg bg-white gap-2">
                <div className="w-full h-40 p-2">
                    <div className="flex flex-col h-full gap-4">
                        <div className="flex flex-col h-full gap-1">
                            <span className="font-semibold">Details</span>
                            <div className="border-2 h-full rounded-sm p-1"> {order.orderDetails}</div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-end items-end gap-3">
                    <Button className="bg-red-600 hover:bg-red-700">Cancel</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Rebook</Button>
                    <Button>Contact</Button>
                </div>
            </div>
        </CollapsibleContent>
       </Collapsible>
    );
}

export default AnnouncementCard;