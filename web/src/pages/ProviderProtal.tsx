import ServiceOrderCard from "@/components/ServiceOrderCard";
import { type OrderView } from "@/types/order";
import { useState } from "react";

const ProviderPortal = () => {
    // Sort announcement by time 
    const [announcement, setAnnouncements] = useState<OrderView[]>([{
    id: 1,
    providerName: "Bright & Shine",
    serviceDate: "2025-08-10",
    serviceTime: "13:00",
    serviceType: "Cleaning",
    status: "Scheduled",
    rating: 4,
    orderDate: "2025-08-01"
  },
  {
    id: 2,
    providerName: "FixIt Pros",
    serviceDate: "2025-08-12",
    serviceTime: "10:30",
    serviceType: "Maintenance",
    status: "Scheduled",
    rating: null,
    orderDate: "2025-08-03"
  },
  {
    id: 3,
    providerName: "Quick Clean Co.",
    serviceDate: "2025-08-15",
    serviceTime: "09:15",
    serviceType: "Cleaning",
    status: "Scheduled",
    rating: null,
    orderDate: "2025-08-05"
  }]);

    // sort history by time and filter by past dates
    const [history, setHistory] = useState([]);
   
    return (
    <div className="w-full h-full px-4 pb-4">
        <div className="flex w-full h-full gap-8">
            {/* Left */}
            <div className="flex flex-col w-full h-full gap-4">
                <div className="flex h-full w-full border-4 rounded-lg">
                    Schedule Calendar
                </div>
                <div className="flex h-full w-full border-4 ">
                    Hours 
                </div> 
            </div>
            {/* Right */}
            <div className="flex w-full h-full gap-4">
                <div className="flex flex-col w-full h-full gap-4 ">
                    {/* Announcement Panel */}
                    <div className="flex flex-col h-4/6 w-full border-4 rounded-lg ">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl ">Anouncements</label>
                        </div>
                        <div className="flex flex-col h-full w-full items-center overflow-y-auto">
                            {announcement.length > 0?   
                            announcement.map((order, key) => (
                                <div className="flex w-full">
                                 <ServiceOrderCard order={order}/>
                                 </div>
                            )): 
                            <div className="flex w-full h-full justify-center items-center">
                                <span> No announcements for today</span>
                            </div>
                        }
                           
                        </div>    
                        
                    </div>
                    {/* Control Panel */}
                    <div className="flex flex-col h-full w-full border-4 rounded-lg ">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl">Control Panel</label>
                        </div>
                        <div className="flex w-full h-full justify-center items-center">
                            Control Actions
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-col h-full w-full border-4 rounded-lg ">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl "> History</label>
                           
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ProviderPortal;