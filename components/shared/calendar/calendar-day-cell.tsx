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
import { CALENDAR_FADE_HEIGHT } from "@/components/shared/calendar/constants";

const DEFAULT_IMAGE = "/images/poster_default.png";

interface CalendarDayCellProps {
  day: Date;
  dayEvents: CalendarEvent[];
  isCurrentMonth: boolean;
  isHovered: boolean;
  isTodayDate: boolean;
  isSelected: boolean;
  dayNumber: number;
  isXl: boolean;
  is2xl: boolean;

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
  is2xl,
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
    is2xl,
    dayEvents,
    buttonRef,
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
  const imageUrl = getImageUrl(eventImage) || DEFAULT_IMAGE;

  const dayKey = format(day, "yyyy-MM-dd");
  const fadeHeight = is2xl
    ? CALENDAR_FADE_HEIGHT["2xl"]
    : CALENDAR_FADE_HEIGHT.xl;

  return (
    <motion.div
      key={`cell-${dayKey}`}
      ref={divRef}
      className={
        isXl
          ? "overflow-visible flex-1 flex flex-col w-full relative"
          : "overflow-hidden relative"
      }
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
      style={
        isXl
          ? { zIndex: isHovered ? 10 : 1, position: "relative" }
          : getCellContainerStyles(isXl, isHovered)
      }
    >
      <motion.button
        key={`button-${dayKey}`}
        ref={buttonRef}
        onClick={() => onDateClick(day)}
        onMouseEnter={
          isXl && dayEvents.length > 0 ? () => onMouseEnter(day) : undefined
        }
        onMouseLeave={isXl && dayEvents.length > 0 ? onMouseLeave : undefined}
        className={cn(
          getButtonClassName(isXl, isHovered, dayEvents, isCurrentMonth),
          isXl && "flex-1 w-full",
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
        style={
          isXl
            ? {
                position: "relative",
                zIndex: isHovered ? 10 : 1,
                overflow: isHovered ? "auto" : "hidden",
                ...(isHovered && expandedHeight
                  ? { height: `${expandedHeight}px` }
                  : {}),
              }
            : getButtonStyles(isXl, isHovered)
        }
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

        {isXl && isHovered && (
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 pointer-events-none z-30"
            style={{
              height: fadeHeight,
              background:
                "linear-gradient(to bottom, #FF491A 0%, rgba(255,73,26,0) 100%)",
            }}
          />
        )}

        <CalendarDayHeader
          dayNumber={dayNumber}
          isXl={isXl}
          is2xl={is2xl}
          isSelected={isSelected}
          isTodayDate={isTodayDate}
          isHovered={isHovered}
          hasImage={!!eventImage}
        />

        <CalendarDayEvents
          events={dayEvents}
          isXl={isXl}
          is2xl={is2xl}
          isHovered={isHovered}
          isCurrentMonth={isCurrentMonth}
          eventsContainerRef={eventsContainerRef}
          isOverflowing={isOverflowing}
        />
      </motion.button>
    </motion.div>
  );
};
