"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { Title } from "@/components/shared/typography";
import {
  getEventsContainerStyles,
  getEventsContainerClassName,
} from "@/components/shared/calendar/utils/calendar-cell-styles";

interface CalendarDayEventsProps {
  events: CalendarEvent[];
  isXl: boolean;
  isHovered: boolean;
  isCurrentMonth: boolean;
  eventsContainerRef: React.RefObject<HTMLDivElement | null>;
  isOverflowing: boolean;
}

export const CalendarDayEvents = ({
  events,
  isXl,
  isHovered,
  isCurrentMonth,
  eventsContainerRef,
  isOverflowing,
}: CalendarDayEventsProps) => {
  if (events.length === 0) return null;

  return (
    <>
      <div
        ref={eventsContainerRef}
        className={getEventsContainerClassName(
          isXl,
          isHovered,
          isCurrentMonth,
          isOverflowing
        )}
        style={getEventsContainerStyles(isXl, isHovered, isOverflowing)}
      >
        {events.map((event, eventIndex) => (
          <div
            key={eventIndex}
            className={cn(
              "flex flex-col gap-4",
              isHovered && isXl ? "text-white" : "text-black"
            )}
          >
            <div>
              <Title
                className={cn(
                  "text-black xl:text-[16px] 2xl:text-[20px]",
                  isHovered && isXl ? "text-white" : "text-black"
                )}
              >
                {event.clubName}
              </Title>
            </div>

            <div className="flex flex-col xl:gap-2 2xl:gap-2.5">
              {event.performances?.map((performance, performanceIndex) => (
                <Title
                  key={performanceIndex}
                  className={cn(
                    "font-medium xl:text-[14px] 2xl:text-[16px] text-black-60",
                    isHovered && isXl ? "text-white" : "text-black"
                  )}
                >
                  {performance.title}
                </Title>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!isHovered && isOverflowing && (
        <div className="hidden xl:absolute xl:bottom-4 xl:right-4 xl:flex xl:items-center xl:justify-end">
          <Plus className="xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-black" />
        </div>
      )}
    </>
  );
};
