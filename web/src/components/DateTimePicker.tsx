"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface DateTimePickerProps {
  selectedTimestamp: number | undefined;
  setSelectedTimestamp: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  occupiedTimestamps: number[];
}

const DateTimePicker = ({
  selectedTimestamp,
  setSelectedTimestamp,
  occupiedTimestamps,
}: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const timeSlots = React.useMemo(() => {
    return Array.from({ length: 37 }, (_, i) => {
      const totalMinutes = i * 15;
      const hour = Math.floor(totalMinutes / 60) + 9;
      const minute = totalMinutes % 60;
      return { hour, minute };
    });
  }, []);
  const getFullyBookedDates = (occupiedTimestamps: number[]): Date[] => {
    const slotsPerDay = 37;
    const map = new Map<string, number>();

    occupiedTimestamps.forEach((ts) => {
      const d = new Date(ts);
      const key = d.toDateString();
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .filter(([_, count]) => count >= slotsPerDay)
      .map(([dateStr]) => new Date(dateStr));
  };

  const disableDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = date < today;

    const isFullyBooked = getFullyBookedDates(occupiedTimestamps).some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
    return isPast || isFullyBooked;
  };

  return (
    <Card className="gap-0 p-0">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            defaultMonth={selectedDate}
            disabled={disableDates}
            showOutsideDays={false}
            className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            modifiers={{
              booked: getFullyBookedDates(occupiedTimestamps),
              past: (date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
            }}
            modifiersClassNames={{
              booked: "line-through text-gray-400",
              past: "line-through text-gray-400",
            }}
            formatters={{
              formatWeekdayName: (date) =>
                date.toLocaleString("en-US", { weekday: "short" }),
            }}
          />
        </div>

        <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <div className="grid gap-2">
            {selectedDate &&
              timeSlots.map(({ hour, minute }) => {
                const timestamp = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
                  hour,
                  minute
                ).getTime();

                const isDisabled = occupiedTimestamps.includes(timestamp);

                const label = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;

                return (
                  <Button
                    key={timestamp}
                    variant={
                      selectedTimestamp === timestamp ? "default" : "outline"
                    }
                    onClick={() =>
                      !isDisabled && setSelectedTimestamp(timestamp)
                    }
                    disabled={isDisabled}
                    className={`w-full shadow-none ${
                      isDisabled
                        ? "line-through text-gray-400 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {label}
                  </Button>
                );
              })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
        <div className="text-sm">
          {selectedTimestamp ? (
            <>
              Your meeting is booked for{" "}
              <span className="font-medium">
                {new Date(selectedTimestamp).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              at{" "}
              <span className="font-medium">
                {new Date(selectedTimestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              .
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>

        <Button
          disabled={!selectedTimestamp}
          className="w-full md:ml-auto md:w-auto"
          variant="outline"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DateTimePicker;
