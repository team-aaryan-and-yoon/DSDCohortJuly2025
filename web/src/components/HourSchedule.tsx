import { type JSX } from "react";

interface EventItem {
  startTime: string;
  endTime: string;
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

  // Function to convert time string like "12:30 PM" to Date object
  const parseTimeString = (timeStr: string) => {
    // Extract hours, minutes, and period
    const match = timeStr.match(/(\d+):(\d+)\s*([AP]M)?/i);
    if (!match) return new Date(0, 0, 0, 0, 0);

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3]?.toUpperCase();

    // Handle 12-hour format
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(0, 0, 0, hours, minutes);
  };

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let quarter = 0; quarter < 60; quarter += 15) {
      if (hour === endHour && quarter > 0) break;

      const time = new Date(0, 0, 0, hour, quarter);
      const label = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      // Generate current time for comparison
      const currentTime = new Date(0, 0, 0, hour, quarter);

      // Find events that overlap with this time slot
      const eventsForSlot = events.filter((e) => {
        const eventStart = parseTimeString(e.startTime);
        const eventEnd = parseTimeString(e.endTime);

        // Handle case when end time is on the next day
        if (eventEnd < eventStart) {
          eventEnd.setDate(1); // Set to next day
        }

        // Check if this time slot is within the event's time range
        return currentTime >= eventStart && currentTime < eventEnd;
      });

      // Sort by start time so we display the earliest event for this slot
      eventsForSlot.sort((a, b) => {
        return (
          parseTimeString(a.startTime).getTime() -
          parseTimeString(b.startTime).getTime()
        );
      });

      // Get the first event for this time slot (if any)
      const event = eventsForSlot.length > 0 ? eventsForSlot[0] : undefined;

      // Check if this is the start time of an event (to show full details only once)
      const isStartTime =
        event &&
        parseTimeString(event.startTime).getTime() === currentTime.getTime();

      // Style for the row
      const rowStyle = {
        backgroundColor: event
          ? event.title.toLowerCase().includes("cleaning")
            ? "#3b82f6"
            : "#ef4444"
          : "",
      };

      slots.push(
        <tr
          style={rowStyle}
          key={`${hour}-${quarter}`}
          onClick={() => {
            /* Event details could be shown in a modal instead of console */
          }}
          className={`hover:bg-gray-100 ${event ? "event-slot" : ""}`}>
          <td className="font-bold p-2 whitespace-nowrap">{label}</td>
          <td className="border-l border-gray-300 p-2 whitespace-normal break-words">
            {event && isStartTime ? (
              <div className="event-content">
                <div className="font-medium">{event.title}</div>
                {event.description && (
                  <div className="text-xs break-words mt-1">
                    {event.description}
                  </div>
                )}
                <div className="text-xs mt-1">
                  {`${event.startTime} - ${event.endTime}`}
                </div>
              </div>
            ) : event ? (
              <div className="event-continuation">
                {/* Just show a thin bar for continuation cells */}
              </div>
            ) : (
              ""
            )}
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <style>
        {`
        .event-slot {
          position: relative;
        }
        .event-slot td {
          border-top: none;
          border-bottom: none;
        }
        .event-content {
          padding: 4px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.2);
        }
        .event-continuation {
          height: 100%;
          width: 100%;
        }
        `}
      </style>
      <div className="w-full overflow-hidden">
        <table className="w-full bg-white">
          <thead>
            <tr className="sticky top-0 z-10 bg-gradient-to-br from-blue-50 to-indigo-100 text-lg">
              <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                Time
              </th>
              <th className="h-10 px-2 text-left align-middle font-medium border-l border-gray-300">
                Event
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{slots}</tbody>
        </table>
      </div>
    </div>
  );
};

export default HourSchedule;
