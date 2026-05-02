"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { Subtitle, Title } from "@/components/shared/typography";
import {
  getEventsContainerStyles,
  getEventsContainerClassName,
} from "@/components/shared/calendar/utils/calendar-cell-styles";

interface CalendarDayEventsProps {
  events: CalendarEvent[];
  isXl: boolean;
  is2xl: boolean;
  isHovered: boolean;
  isCurrentMonth: boolean;
  eventsContainerRef: React.RefObject<HTMLDivElement | null>;
  isOverflowing: boolean;
}

export const CalendarDayEvents = ({
  events,
  isXl,
  is2xl,
  isHovered,
  isCurrentMonth,
  eventsContainerRef,
  isOverflowing,
}: CalendarDayEventsProps) => {
  const [hoveredEventIndex, setHoveredEventIndex] = useState<number | null>(
    null,
  );
  if (events.length === 0) return null;

  return (
    <>
      <div
        ref={eventsContainerRef}
        className={getEventsContainerClassName(isXl, is2xl, isHovered, isCurrentMonth)}
        style={getEventsContainerStyles(isXl, isHovered, isOverflowing)}
      >
        {events.map((event, eventIndex) => {
          const isHoveredEvent = hoveredEventIndex === eventIndex;

          return (
            <div
              key={eventIndex}
              className={cn(
                "relative flex flex-col",
                is2xl ? "gap-3" : "gap-2.5",
                isHovered && isXl ? "text-white" : "text-black",
              )}
              onMouseEnter={() => setHoveredEventIndex(eventIndex)}
              onMouseLeave={() => setHoveredEventIndex(null)}
            >
              {isHoveredEvent && isXl && (
                <div
                  className={cn(
                    "absolute -z-10 bg-[#E54217]",
                    is2xl
                      ? "-left-6 -right-6 -top-6 -bottom-4"
                      : "-left-4 -right-4 -top-4 -bottom-4",
                  )}
                  aria-hidden
                />
              )}
              <div className="flex justify-between min-w-0">
                <Title
                  className={cn(
                    "truncate",
                    is2xl ? "xl:text-[20px]" : "xl:text-[16px]",
                    isHovered && isXl ? "text-white" : "text-black",
                  )}
                >
                  <Link href={`/club/${event.id}`}>{event.clubName}</Link>
                </Title>
              </div>

              <div className="flex flex-col xl:gap-2 2xl:gap-2.5">
                {event.performances?.map((performance, performanceIndex) => {
                  const isLastPerformance =
                    performanceIndex === (event.performances?.length ?? 0) - 1;

                  return (
                    <Link
                      key={performanceIndex}
                      href={`/performance/${performance.id}`}
                      className="cursor-pointer transition-opacity flex justify-between items-center"
                    >
                      <Subtitle
                        className={cn(
                          "truncate min-w-0",
                          is2xl ? "xl:text-[17px]" : "xl:text-[14px]",
                          isHovered && isXl
                            ? "text-white/80 font-semibold"
                            : "text-black-60 font-medium",
                        )}
                      >
                        {performance.artists?.map((a) => a.name).join(", ")}
                      </Subtitle>
                      {isLastPerformance && (
                        <div
                          className={cn(
                            "flex-shrink-0",
                            is2xl ? "w-6 h-6" : "w-5 h-5",
                            !isHoveredEvent && "invisible",
                          )}
                        >
                          <Image
                            src={"/images/calendar-arrow-right.svg"}
                            alt={event.clubName}
                            width={is2xl ? 24 : 20}
                            height={is2xl ? 24 : 20}
                          />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!isHovered && isOverflowing && isXl && (
        <div
          className={cn(
            "absolute flex items-center justify-end pointer-events-none",
            is2xl ? "bottom-6 right-6 w-5 h-5" : "bottom-4 right-4 w-5 h-5",
          )}
        >
          <Plus
            className={cn(
              "text-black",
              is2xl ? "w-5 h-5" : "w-5 h-5",
            )}
          />
        </div>
      )}
    </>
  );
};
