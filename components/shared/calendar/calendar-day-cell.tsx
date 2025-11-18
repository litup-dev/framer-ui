"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { useCalendarCellHeight } from "./hooks/use-calendar-cell-height";
import { useCalendarCellScroll } from "./hooks/use-calendar-cell-scroll";
import { useCalendarCellOverflow } from "./hooks/use-calendar-cell-overflow";
import {
  getCellContainerStyles,
  getButtonStyles,
  getButtonClassName,
} from "./utils/calendar-cell-styles";
import { CalendarDayHeader } from "./components/calendar-day-header";
import { CalendarDayEvents } from "./components/calendar-day-events";

interface CalendarDayCellProps {
  day: Date;
  dayEvents: CalendarEvent[];
  isCurrentMonth: boolean;
  isHovered: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  dayNumber: number;
  isXl: boolean;
  maxEventsPerDay: number;
  isRowExpanded: boolean;
  isCollapsedAndNotSelected: boolean;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

export const CalendarDayCell = ({
  day,
  dayEvents,
  isCurrentMonth,
  isHovered,
  isTodayDate,
  isSelected,
  dayNumber,
  isXl,
  isRowExpanded,
  isCollapsedAndNotSelected,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
}: CalendarDayCellProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const expandedHeight = useCalendarCellHeight({
    isHovered,
    isXl,
    dayEvents,
    buttonRef,
    divRef,
  });

  const eventsContainerRef = useCalendarCellScroll({
    isHovered,
    isXl,
  });

  const isOverflowing = useCalendarCellOverflow({
    isHovered,
    dayEvents,
    dayNumber,
    eventsContainerRef,
  });

  return (
    <motion.div
      ref={divRef}
      className={isXl ? "overflow-visible" : "overflow-hidden relative"}
      initial={false}
      animate={{
        height: !isXl ? (isRowExpanded ? "auto" : "0px") : undefined,
      }}
      transition={{
        height: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }}
      style={getCellContainerStyles(isXl, isHovered, expandedHeight)}
    >
      <motion.button
        ref={buttonRef}
        onClick={() => onDateClick(day)}
        onMouseEnter={isXl ? () => onMouseEnter(day) : undefined}
        onMouseLeave={isXl ? onMouseLeave : undefined}
        className={getButtonClassName(
          isXl,
          isHovered,
          dayEvents,
          isCurrentMonth
        )}
        initial={false}
        animate={{
          opacity: !isXl && isCollapsedAndNotSelected ? 0.2 : 1,
        }}
        transition={{
          opacity: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
        style={getButtonStyles(isXl, isHovered, expandedHeight)}
      >
        {!isXl && dayEvents[0]?.image && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src={dayEvents[0].image}
              alt={dayEvents[0].venue}
              fill
              className="object-cover"
              sizes="50px"
            />
          </div>
        )}

        <CalendarDayHeader
          dayNumber={dayNumber}
          isXl={isXl}
          isSelected={isSelected}
          isTodayDate={isTodayDate}
          isHovered={isHovered}
          hasImage={!!dayEvents[0]?.image}
        />

        <CalendarDayEvents
          events={dayEvents}
          isXl={isXl}
          isHovered={isHovered}
          isCurrentMonth={isCurrentMonth}
          eventsContainerRef={eventsContainerRef}
          isOverflowing={isOverflowing}
        />
      </motion.button>
    </motion.div>
  );
};
