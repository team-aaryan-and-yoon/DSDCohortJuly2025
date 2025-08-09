import type { JSX } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface EventItem {
  time: string;
  title: string;
  description?: string;
}

interface HourScheduleProps {
  events?: EventItem[];
  startHour?: number;
  endHour?: number;
}

const HourSchedule = ({
  events = [],
  startHour = 9,
  endHour = 17,
}: HourScheduleProps) => {
  const slots: JSX.Element[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let quarter = 0; quarter < 60; quarter += 15) {
      if (hour === endHour && quarter > 0) break;

      const time = new Date(0, 0, 0, hour, quarter);
      const label = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      const event = events.find((e) => e.time === label);

      slots.push(
        <TableRow
            style={{ backgroundColor: event?.title == "Cleaning"? "#3b82f6": event?.title == "Maintenance"? "#ef4444": "" }}   
        
          key={`${hour}-${quarter}`}
          onClick={() => console.log(event?.time + "\n" + event?.description)}
        >
          <TableCell className="w-24 font-bold ">
            {label}
          </TableCell>
          <TableCell className="border-l border-gray-300">
            {event ? (
              <div>
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="text-xs ">
                    {event.description}
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </TableCell>
        </TableRow>
      );
    }
  }

  return (
    <Table className="bg-white">
      <TableHeader>
        <TableRow className="sticky top-0 bg-gray-100 z-10">
          <TableHead className="w-24">Time</TableHead>
          <TableHead className="border-l border-gray-300">Event</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{slots}</TableBody>
    </Table>
  );
};

export default HourSchedule;
