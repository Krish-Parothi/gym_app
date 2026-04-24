"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Attendance {
  id: string;
  check_in: string;
}

export function AttendanceCalendar({ attendance }: { attendance: Attendance[] }) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const attendedDates = attendance.map((a) => new Date(a.check_in));

  const hasAttendance = (date: Date) => {
    return attendedDates.some((d) => isSameDay(d, date));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = monthStart.getDay();

  return (
    <div className="space-y-4">
      <div className="text-center font-medium text-foreground">
        {format(today, "MMMM yyyy")}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const attended = hasAttendance(day);
          const todayDate = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm transition-colors",
                attended && "bg-primary text-primary-foreground",
                !attended && todayDate && "bg-secondary text-foreground ring-2 ring-primary",
                !attended && !todayDate && "text-muted-foreground"
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary ring-2 ring-primary" />
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
}
