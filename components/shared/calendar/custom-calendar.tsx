"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { addMonths, subMonths } from "date-fns";

import { useHomeStore } from "@/app/feature/home/store/home-store";

import { CalendarHeader } from "@/components/shared/calendar/calendar-header";
import { CalendarWeekdays } from "@/components/shared/calendar/calendar-weekdays";
import { CalendarGrid } from "@/components/shared/calendar/calendar-grid";
import { CalendarSelectedEvents } from "@/components/shared/calendar/calendar-selected-events";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { useResponsive } from "@/components/shared/calendar/hooks/use-responsive";
import { useCalendarDays } from "@/components/shared/calendar/hooks/use-calendar-days";
import CalendarListView from "@/components/shared/calendar/calendar-list-view";

interface CustomCalendarProps {
  events?: Record<string, CalendarEvent[]>;
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
  currentMonth?: Date;
  onMonthChange?: (month: Date) => void;
}

const CustomCalendar = ({
  events = {},
  onDateSelect,
  selectedDate,
  currentMonth: externalCurrentMonth,
  onMonthChange,
}: CustomCalendarProps) => {
  const { calendarView } = useHomeStore();
  const [internalCurrentMonth, setInternalCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const currentMonth = externalCurrentMonth ?? internalCurrentMonth;
  const setCurrentMonth = onMonthChange ?? setInternalCurrentMonth;

  const isXl = useResponsive();
  const days = useCalendarDays(currentMonth);

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
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
    <div className="w-screen relative md:pt-20 xl:pb-[388px]">
      {calendarView === "calendar" && (
        <div className="bg-gray">
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
      )}
      {calendarView === "list" && (
        <CalendarListView onDateSelect={(date) => onDateSelect?.(date)} />
      )}
    </div>
  );
};

export default CustomCalendar;
export type { CalendarEvent };
