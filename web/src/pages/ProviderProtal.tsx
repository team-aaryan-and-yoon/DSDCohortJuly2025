import AnnouncementCard from "@/components/AnnouncementCard";
import  { FullCalendar, type CalendarEvent } from "@/components/FullSchedule";
import HourSchedule from "@/components/HourSchedule";
import ServiceOrderCard from "@/components/ServiceOrderCard";
import { Button } from "@/components/ui/button";
import { type ProviderOrderView } from "@/types/order";
import { useState } from "react";

const ProviderPortal = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    // Sort announcement by time 
    const [announcement, setAnnouncements] = useState<ProviderOrderView[]>([{
    id: 1,
    clientName: "Joe Doe",
    serviceDate: "2025-08-10",
    serviceTime: "13:00",
    serviceLocation: "123 Main st",
    serviceType: "Cleaning",
    status: "Scheduled",
    rating: 4,
    orderDate: "2025-08-01"

  },
  {
    id: 2,
    clientName: "Mary Su",
    serviceDate: "2025-08-12",
    serviceLocation: "456 Palm way",
    serviceTime: "10:30",
    serviceType: "Maintenance",
    status: "Scheduled",
    rating: null,
    orderDate: "2025-08-03"
  },
  {
    id: 3,
    clientName: "Perry Stu",
    serviceDate: "2025-08-15",
    serviceTime: "09:15",
    serviceLocation: "789 Free Crossing",
    serviceType: "Cleaning",
    status: "Scheduled",
    rating: null,
    orderDate: "2025-08-05"
  }]);

    // sort history by time and filter by past dates
    const [history, setHistory] = useState([]);
    const events: CalendarEvent[] = [
    {
        id: "1",
        title: "Maintenance",
        start: new Date("2025-08-10T10:00:00"),
        end: new Date("2025-08-10T11:00:00"),
        color: "#ef4444",
        description: "AC unit checkup",
    },
    {
        id: "2",
        title: "Cleaning",
        start: new Date("2025-08-11T13:00:00"),
        end: new Date("2025-08-11T14:00:00"),
        color: "#3b82f6",
        description: "Kitchen deep clean",
    },
    {
        id: "3",
        title: "Cleaning",
        start: new Date("2025-08-11T15:00:00"),
        end: new Date("2025-08-11T16:00:00"),
        color: "#3b82f6",
        description: "Living room and carpets",
    },
    {
        id: "4",
        title: "Maintenance",
        start: new Date("2025-08-11T17:00:00"),
        end: new Date("2025-08-11T18:00:00"),
        color: "#3b82f6",
        description: "Fix leaking sink",
    },
    ];
    
    return (
    <div className="w-full h-full px-4 pb-4">
        <div className="flex w-full h-full gap-8">
            {/* Left */}
            <div className="flex flex-col w-full h-full gap-4">
                <div className="flex justify-center h-7/12 w-full rounded-lg">
                    <FullCalendar   
                        events={events}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onDayClick={(date) => {
                        console.log("Clicked:", date.toDateString());
                    }}/>

                </div>
                <div className="flex h-5/12 w-full border-4 rounded-lg ">
                {selectedDate? 
                    <HourSchedule
                   
                    events={events
                            .filter((event) => {
                                return (
                                event.start.toDateString() === selectedDate.toDateString()
                                );
                            })
                            .map((event) => ({
                                time: event.start.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                }),
                                title: event.title,
                                description: event.description,
                            }))}
                    />
                    :
                    <div className="flex w-full justify-center items-center">
                        <span className="font-light">Select a date to see time schedueld</span>
                    </div>}
                </div> 
            </div>
            {/* Right */}
            <div className="flex w-full h-full gap-4">
                <div className="flex flex-col w-full h-full gap-4 ">
                    {/* Announcement Panel */}
                    <div className="flex flex-col h-4/6 w-full border-4 rounded-lg bg-white">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl ">Anouncements</label>
                        </div>
                        <div className="flex flex-col h-full w-full items-center gap-2 p-2 overflow-y-auto">
                            {announcement.length > 0?   
                            announcement.map((order, key) => (
                                <div key={key} className="flex w-full justify-center border-2 rounded-md">
                                    <AnnouncementCard order={order}/>
                                </div>
                            )): 
                            <div className="flex w-full h-full justify-center items-center">
                                <span> No announcements for today</span>
                            </div>
                        }  
                        </div>    
                        
                    </div>
                    {/* Control Panel */}
                    <div className="flex flex-col h-2/6 w-full border-4 rounded-lg bg-white">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl">Control Panel</label>
                        </div>
                        <div className="flex w-full h-full justify-center items-center gap-4 p-4">
                            <Button>Manage Profile</Button>
                            <Button >Manage Payments</Button>
                            <Button>Manage Schedule</Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full">
                    <div className="flex flex-col h-full w-full border-4 rounded-lg bg-white">
                        <div className="flex w-full justify-center border-b-4">
                            <label className="font-bold text-xl "> 
                                History
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ProviderPortal;