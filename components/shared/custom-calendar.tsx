"use client";

import { useState, useEffect, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { format } from "date-fns";

import { CalendarHeader } from "@/components/shared/calendar/calendar-header";
import { CalendarWeekdays } from "@/components/shared/calendar/calendar-weekdays";
import { CalendarGrid } from "@/components/shared/calendar/calendar-grid";
import { CalendarSelectedEvents } from "@/components/shared/calendar/calendar-selected-events";
import { CalendarEvent } from "@/components/shared/calendar/types";

interface CustomCalendarProps {
  events?: Record<string, CalendarEvent[]>;
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
  maxEventsPerDay?: number;
}

const CustomCalendar = ({
  events = {},
  onDateSelect,
  selectedDate,
  maxEventsPerDay = 4,
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isXl, setIsXl] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkXl = () => {
      setIsXl(window.innerWidth >= 1280);
    };
    checkXl();
    window.addEventListener("resize", checkXl);
    return () => window.removeEventListener("resize", checkXl);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
    if (!isXl) {
      const dayIndex = days.findIndex(
        (d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      if (dayIndex !== -1) {
        const rowIndex = Math.floor(dayIndex / 7);
        setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
      }
    }
  };

  const handleMouseEnter = (date: Date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const handleExpandAll = () => {
    setSelectedRowIndex(null);
    onDateSelect?.(undefined);
  };

  const selectedDateEvents = useMemo((): CalendarEvent[] => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return events[dateKey] || [];
  }, [selectedDate, events]);

  return (
    <div className="w-screen bg-gray relative xl:pb-[388px]">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <CalendarWeekdays isXl={isXl} />
      <CalendarGrid
        days={days}
        currentMonth={currentMonth}
        events={events}
        hoveredDate={hoveredDate}
        isXl={isXl}
        maxEventsPerDay={maxEventsPerDay}
        selectedRowIndex={selectedRowIndex}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onExpandAll={handleExpandAll}
      />
      <CalendarSelectedEvents
        selectedDate={selectedDate || null}
        events={selectedDateEvents}
      />
    </div>
  );
};

export default CustomCalendar;
export type { CalendarEvent };
