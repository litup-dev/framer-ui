"use client";

import Image from "next/image";
import { format, isSameMonth, isSameDay, isToday, getDate } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDayCell } from "@/components/shared/calendar/calendar-day-cell";
import { CalendarEvent } from "@/components/shared/calendar/types";

interface CalendarGridProps {
  days: Date[];
  currentMonth: Date;
  events: Record<string, CalendarEvent[]>;
  hoveredDate: Date | null;
  isXl: boolean;
  maxEventsPerDay: number;
  selectedRowIndex: number | null;
  selectedDate?: Date;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
  onExpandAll?: () => void;
}

export const CalendarGrid = ({
  days,
  currentMonth,
  events,
  hoveredDate,
  isXl,
  maxEventsPerDay,
  selectedRowIndex,
  selectedDate,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
  onExpandAll,
}: CalendarGridProps) => {
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return events[dateKey] || [];
  };

  const rows = Array.from(
    { length: Math.ceil(days.length / 7) },
    (_, rowIndex) => {
      const isRowExpanded =
        !isXl && (selectedRowIndex === null || selectedRowIndex === rowIndex);
      const isCollapsedAndNotSelected =
        !isXl && selectedRowIndex !== null && selectedRowIndex !== rowIndex;
      return {
        days: days.slice(rowIndex * 7, rowIndex * 7 + 7),
        isRowExpanded,
        isCollapsedAndNotSelected,
      };
    }
  );

  const hasCollapsedRow = !isXl && selectedRowIndex !== null;

  return (
    <div className="relative px-5 xl:px-20">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="relative">
          <div
            className={cn(
              "gap-0 gap-x-0 gap-y-0 relative",
              isXl ? "flex" : "grid grid-cols-7"
            )}
          >
            {row.days.map((day, dayIndexInRow) => {
              const index = rowIndex * 7 + dayIndexInRow;
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isHovered = hoveredDate && isSameDay(day, hoveredDate);
              const isTodayDate = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const dayNumber = getDate(day);

              return (
                <div
                  key={`${format(day, "yyyy-MM-dd")}-${index}`}
                  className={cn(
                    "flex-1 relative",
                    isXl && "w-[250px] flex-shrink-0"
                  )}
                  style={{
                    ...(isXl && isHovered
                      ? {
                          zIndex: 10,
                        }
                      : {}),
                    ...(isXl && {
                      minHeight: "315px",
                    }),
                  }}
                >
                  <CalendarDayCell
                    day={day}
                    dayEvents={dayEvents}
                    isCurrentMonth={isCurrentMonth}
                    isHovered={!!isHovered}
                    isTodayDate={isTodayDate}
                    isSelected={!!isSelected}
                    dayNumber={dayNumber}
                    isXl={isXl}
                    maxEventsPerDay={maxEventsPerDay}
                    isRowExpanded={row.isRowExpanded}
                    isCollapsedAndNotSelected={row.isCollapsedAndNotSelected}
                    onDateClick={onDateClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {hasCollapsedRow && (
        <div
          className="flex items-center justify-center py-4 cursor-pointer"
          onClick={onExpandAll}
        >
          <Image
            src="/images/arrow-down.svg"
            alt="expand"
            width={24}
            height={24}
            className="opacity-60"
          />
        </div>
      )}
    </div>
  );
};
