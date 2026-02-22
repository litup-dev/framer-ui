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
  const [hoveredEventIndex, setHoveredEventIndex] = useState<number | null>(
    null,
  );
  if (events.length === 0) return null;

  return (
    <>
      <div
        ref={eventsContainerRef}
        className={getEventsContainerClassName(
          isXl,
          isHovered,
          isCurrentMonth,
          isOverflowing,
        )}
        style={getEventsContainerStyles(isXl, isHovered, isOverflowing)}
      >
        {events.map((event, eventIndex) => {
          const isHoveredEvent = hoveredEventIndex === eventIndex;

          return (
            <div
              key={eventIndex}
              className={cn(
                "relative flex flex-col gap-4",
                isHovered && isXl ? "text-white" : "text-black",
              )}
              onMouseEnter={() => setHoveredEventIndex(eventIndex)}
              onMouseLeave={() => setHoveredEventIndex(null)}
            >
              {isHoveredEvent && isXl && (
                <div
                  className="absolute -top-6 -bottom-4 -left-6 -right-6 bg-[#E54217] -z-10"
                  aria-hidden
                />
              )}
              <div className="flex justify-between">
                <Title
                  className={cn(
                    "text-black xl:text-[16px] 2xl:text-[20px]",
                    isHovered && isXl ? "text-white" : "text-black",
                  )}
                >
                  {event.clubName}
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
                          "font-medium xl:text-[14px] 2xl:text-[18px] text-black-60 min-w-0",
                          isHovered && isXl ? "text-white" : "text-black-60",
                        )}
                      >
                        {performance.title}
                      </Subtitle>
                      {isLastPerformance && (
                        <div
                          className={cn(
                            "flex-shrink-0 w-6 h-6",
                            !isHoveredEvent && "invisible",
                          )}
                        >
                          <Image
                            src={"/images/calendar-arrow-right.svg"}
                            alt={event.clubName}
                            width={24}
                            height={24}
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
      {!isHovered && isOverflowing && (
        <div className="hidden xl:absolute xl:bottom-6 xl:right-6 xl:flex xl:items-center xl:justify-end">
          <Plus className="xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 text-black" />
        </div>
      )}
    </>
  );
};
