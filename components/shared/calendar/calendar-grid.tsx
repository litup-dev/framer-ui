"use client";

import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDayCell } from "@/components/shared/calendar/calendar-day-cell";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { useCalendarRows } from "./hooks/use-calendar-rows";
import { getEventsForDate, getDayState } from "./utils/calendar-date-helpers";

interface CalendarGridProps {
  days: Date[];
  currentMonth: Date;
  events: Record<string, CalendarEvent[]>;
  hoveredDate: Date | null;
  isXl: boolean;
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
  selectedRowIndex,
  selectedDate,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
  onExpandAll,
}: CalendarGridProps) => {
  const { rows, hasCollapsedRow } = useCalendarRows({
    days,
    selectedRowIndex,
    isXl,
  });

  return (
    <div className="relative px-5 xl:px-20 xl:pb-[100px]">
      {rows.map((row, rowIndex) => {
        const firstDayKey = row.days[0]
          ? format(row.days[0], "yyyy-MM-dd")
          : `row-${rowIndex}`;
        return (
          <div
            key={`${format(currentMonth, "yyyy-MM")}-row-${firstDayKey}`}
            className="relative"
          >
            <div
              className={cn(
                "gap-0 gap-x-0 gap-y-0 relative",
                isXl ? "flex" : "grid grid-cols-7",
              )}
            >
              {row.days.map((day, dayIndexInRow) => {
                const index = rowIndex * 7 + dayIndexInRow;
                const dayEvents = getEventsForDate(day, events);
                const {
                  isCurrentMonth,
                  isHovered,
                  isTodayDate,
                  isSelected,
                  dayNumber,
                } = getDayState(day, currentMonth, hoveredDate, selectedDate);

                return (
                  <div
                    key={`${format(day, "yyyy-MM-dd")}-${index}`}
                    className={cn(
                      "flex-1 relative",
                      isXl && "w-[250px] flex-shrink-0",
                    )}
                    style={{
                      ...(isXl && isHovered
                        ? {
                            zIndex: 10,
                          }
                        : {}),
                      ...(isXl && {
                        height: "315px",
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
        );
      })}
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
