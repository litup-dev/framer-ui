"use client";

import Image from "next/image";
import { useRef } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { useCalendarCellHeight } from "@/components/shared/calendar/hooks/use-calendar-cell-height";
import { useCalendarCellScroll } from "@/components/shared/calendar/hooks/use-calendar-cell-scroll";
import { useCalendarCellOverflow } from "@/components/shared/calendar/hooks/use-calendar-cell-overflow";
import {
  getCellContainerStyles,
  getButtonStyles,
  getButtonClassName,
} from "@/components/shared/calendar/utils/calendar-cell-styles";
import { CalendarDayHeader } from "@/components/shared/calendar/calendar-day-header";
import { CalendarDayEvents } from "@/components/shared/calendar/calendar-day-events";
import { getImageUrl } from "@/app/feature/club/detail/utils/get-image-url";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = "/images/poster1.png";

const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  if (url.startsWith("/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

interface CalendarDayCellProps {
  day: Date;
  dayEvents: CalendarEvent[];
  isCurrentMonth: boolean;
  isHovered: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  dayNumber: number;
  isXl: boolean;

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

  const firstEvent = dayEvents[0];
  const firstPerformance = firstEvent?.performances?.[0];
  const mainImage = firstPerformance?.images?.find((img) => img.isMain);
  const eventImage =
    mainImage?.filePath || firstPerformance?.images?.[0]?.filePath;
  const imageUrl = isValidImageUrl(eventImage)
    ? getImageUrl(eventImage) || DEFAULT_IMAGE
    : DEFAULT_IMAGE;

  const dayKey = format(day, "yyyy-MM-dd");

  return (
    <motion.div
      key={`cell-${dayKey}`}
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
        key={`button-${dayKey}`}
        ref={buttonRef}
        onClick={() => onDateClick(day)}
        onMouseEnter={isXl ? () => onMouseEnter(day) : undefined}
        onMouseLeave={isXl ? onMouseLeave : undefined}
        className={getButtonClassName(
          isXl,
          isHovered,
          dayEvents,
          isCurrentMonth,
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
        style={getButtonStyles(isXl, isHovered, expandedHeight, dayEvents)}
      >
        {!isXl && firstEvent && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={firstEvent.clubName || "Event image"}
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
          hasImage={!!eventImage}
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
