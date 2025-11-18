"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { Title } from "@/components/shared/typography";
import {
  getEventsContainerStyles,
  getEventsContainerClassName,
} from "../utils/calendar-cell-styles";

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
          isCurrentMonth
        )}
        style={getEventsContainerStyles(isXl, isHovered)}
      >
        {events.map((event, eventIndex) => (
          <div
            key={eventIndex}
            className={cn(
              "flex flex-col gap-2.5",
              isHovered && isXl ? "text-white" : "text-black"
            )}
          >
            <div>
              <Title
                className={cn(
                  "text-black xl:text-[20px]",
                  isHovered && isXl ? "text-white" : "text-black"
                )}
              >
                {event.venue}
              </Title>
            </div>
            {event.artists.length > 0 && (
              <div className="flex flex-col">
                {event.artists.map((artist, artistIndex) => (
                  <Title
                    key={artistIndex}
                    className={cn(
                      "font-medium xl:text-[16px] text-black-60",
                      isHovered && isXl ? "text-white" : "text-black"
                    )}
                  >
                    {artist}
                  </Title>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {!isHovered && isOverflowing && (
        <div className="hidden xl:flex xl:items-center xl:justify-end">
          <Plus className="w-6 h-6 text-black" />
        </div>
      )}
    </>
  );
};

