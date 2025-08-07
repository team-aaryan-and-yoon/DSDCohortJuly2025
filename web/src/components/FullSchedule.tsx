import { useState } from "react";
import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string; 
}

interface FullCalendarProps {
  events?: CalendarEvent[];
  onDayClick?: (date: Date) => void;
  className?: string;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const FullCalendar: React.FC<FullCalendarProps> = ({
  events = [],
  onDayClick,
  className,
  selectedDate,
  setSelectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());


  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300 bg-gray-100 text-gray-800">
      <Button variant="ghost"    onClick={prevMonth}>
        <ChevronLeft className="w-5 h-5" />
      </Button> 
      <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
      <Button variant="ghost" onClick={nextMonth}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const start = startOfWeek(new Date());
    return (
      <div className="grid grid-cols-7 px-4 py-2 text-sm font-medium text-center text-gray-500 bg-gray-50 border-b border-gray-300">
        {[...Array(7)].map((_, i) => (
          <div key={i}>{format(addDays(start, i), "EEE")}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(endOfMonth(monthStart));

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isInMonth = isSameMonth(cloneDay, monthStart);
        const isSelected =  selectedDate ? isSameDay(cloneDay, selectedDate) : false;

        const dayEvents = events.filter(
          (event) =>
            isSameDay(event.start, cloneDay) ||
            (event.start < cloneDay && event.end > cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "p-2 border border-gray-300 h-16 text-sm relative bg-gray-50 transition-colors",
              isInMonth
                ? "cursor-pointer hover:bg-gray-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
              isSelected && isInMonth && "bg-gray-300 ring-2 ring-gray-500  ring-offset-gray-100 z-10"
            )}
            onClick={() => {
              if (!isInMonth) return;
              setSelectedDate(cloneDay);
              onDayClick?.(cloneDay);
            }}
          >
            <div className="absolute top-1 right-1 text-xs text-gray-500">
              {format(day, "d")}
            </div>
            <div className="mt-5 space-y-1 overflow-hidden">
              {dayEvents.slice(0, 1).map((event) => (
                <div
                  key={event.id}
                  className="truncate rounded px-1 text-xs text-white"
                  style={{ backgroundColor: event.color || "#6b7280" }}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 1  && (
                <div className="text-[10px] text-gray-400">
                  +{dayEvents.length - 1} more
                </div>
              )}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
    }

    return <div className="px-4">{rows}</div>;
  };

  return (
    <div
      className={cn(
        "bg-gray-100 border border-gray-300 rounded-md shadow text-gray-800 w-full max-w-5xl mx-auto",
        className
      )}
    >
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};
