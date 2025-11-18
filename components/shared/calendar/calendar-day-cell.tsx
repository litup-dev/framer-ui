"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { CalendarEvent } from "@/components/shared/calendar/types";

import { Title } from "@/components/shared/typography";

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
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isHovered || !isXl || !eventsContainerRef.current) return;

    const container = eventsContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isHovered, isXl]);

  useEffect(() => {
    if (!isHovered && eventsContainerRef.current) {
      const checkOverflow = () => {
        const element = eventsContainerRef.current;
        if (element) {
          const overflowing = element.scrollHeight > element.clientHeight;
          setIsOverflowing(overflowing);
        }
      };

      checkOverflow();
      const timeoutId = setTimeout(checkOverflow, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setIsOverflowing(false);
    }
  }, [dayEvents, isHovered, dayNumber]);

  useEffect(() => {
    if (isHovered && isXl && buttonRef.current) {
      const button = buttonRef.current;
      const tempHeight = button.style.height;
      button.style.height = "auto";
      const actualHeight = button.scrollHeight;
      button.style.height = tempHeight;
      setExpandedHeight(actualHeight);
    }
  }, [isHovered, isXl]);

  return (
    <motion.div
      className={cn(
        "overflow-hidden",
        isXl ? (isHovered ? "absolute" : "relative") : "relative"
      )}
      initial={false}
      animate={{
        height: !isXl ? (isRowExpanded ? "auto" : "0px") : undefined,
      }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        zIndex: isHovered && isXl ? 88888 : 1,
        ...(isXl && isHovered && { top: 0, left: 0, right: 0 }),
        ...(isXl && {
          height:
            isHovered && expandedHeight
              ? expandedHeight
              : isHovered
              ? "auto"
              : "315px",
          "--cell-padding-top": "24px",
        }),
        ...(!isXl && !isRowExpanded && { minHeight: "0px" }),
      }}
    >
      <motion.button
        ref={buttonRef}
        onClick={() => onDateClick(day)}
        onMouseEnter={isXl ? () => onMouseEnter(day) : undefined}
        onMouseLeave={isXl ? onMouseLeave : undefined}
        className={cn(
          "flex flex-col text-left",
          isXl ? "p-6" : "p-1",
          "h-auto min-h-[62px] sm:min-h-[117px] md:min-h-[159px] xl:min-h-[315px]",
          isHovered && isXl
            ? "bg-main text-white"
            : dayEvents.length === 0
            ? "bg-gray text-black"
            : "bg-white text-black",
          !isCurrentMonth && "opacity-50"
        )}
        initial={false}
        animate={{
          height: isXl
            ? isHovered && expandedHeight
              ? expandedHeight
              : isHovered
              ? "auto"
              : 315
            : "auto",
          opacity: !isXl && isCollapsedAndNotSelected ? 0.2 : 1,
        }}
        transition={
          isXl
            ? {
                height: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }
            : {
                opacity: {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                },
              }
        }
        onAnimationComplete={() => {
          if (isXl && !isHovered && expandedHeight !== null) {
            setExpandedHeight(null);
          }
        }}
        style={{
          width: "100%",
          position: isXl ? "absolute" : "relative",
          ...(isXl && { top: 0, left: 0, right: 0 }),
          zIndex: isHovered && isXl ? 88888 : 1,
          willChange: isHovered && isXl ? "height" : "auto",
        }}
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
        <div
          className={cn(
            "xl:flex xl:items-center relative",
            isXl ? "justify-between xl:mb-10 z-50" : "justify-center z-10"
          )}
        >
          <div
            className={cn(
              !isXl &&
                "rounded-full w-6 h-6 flex items-center justify-center min-w-[24px]",
              !isXl && isSelected && "bg-main",
              !isXl && isTodayDate && !isSelected && "bg-[#AECACD]",
              !isXl &&
                !isSelected &&
                !isTodayDate &&
                dayEvents[0]?.image &&
                "bg-black-60"
            )}
          >
            <Title
              className={cn(
                "text-start text-[12px] xl:text-[20px]",
                !isXl && dayEvents[0]?.image
                  ? "text-white"
                  : !isXl && (isSelected || isTodayDate)
                  ? "text-white"
                  : isHovered && isXl
                  ? "text-white xl:text-white"
                  : "text-black xl:text-black"
              )}
            >
              {dayNumber}
            </Title>
          </div>
          {isTodayDate && isXl && (
            <div
              className={cn(
                "leading-4",
                isHovered && isXl ? "bg-transparent" : "bg-[#AECACD]"
              )}
            >
              <Title
                className={cn(
                  "text-black xl:text-[20px]",
                  isHovered && isXl ? "text-white" : "text-black"
                )}
              >
                today
              </Title>
            </div>
          )}
        </div>

        {dayEvents.length > 0 && (
          <>
            <div
              ref={eventsContainerRef}
              className={cn(
                "flex flex-col relative",
                isHovered && isXl
                  ? "max-h-[560px] overflow-y-auto gap-8 scrollbar scrollbar-w-[5px] scrollbar-track-transparent scrollbar-thumb-black/20 hover:scrollbar-thumb-black/30 scrollbar-thumb-rounded-none scrollbar-track-rounded-none scrollbar-thumb-min-100 z-10"
                  : isXl
                  ? "max-h-[315px] overflow-hidden mt-1 pb-6 gap-8 z-10"
                  : "hidden",
                !isCurrentMonth && "opacity-50"
              )}
              style={{
                width: isXl ? "calc(100% + 48px)" : "100%",
                boxSizing: "border-box",
                paddingLeft: isHovered && isXl ? "24px" : "0",
                paddingRight: isHovered && isXl ? "24px" : "0",
                marginRight: isHovered && isXl ? "-24px" : "0",
                marginLeft: isHovered && isXl ? "-24px" : "0",
                marginTop:
                  isHovered && isXl
                    ? "calc(-1 * (24px + 28px + 40px + 32px + 8px))"
                    : undefined,
                paddingTop:
                  isHovered && isXl
                    ? "calc(24px + 28px + 40px + 32px + 8px)"
                    : undefined,
                maskImage:
                  isHovered && isXl
                    ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%)"
                    : "none",
                WebkitMaskImage:
                  isHovered && isXl
                    ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%)"
                    : "none",
              }}
            >
              {dayEvents.map((event, eventIndex) => (
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
        )}
      </motion.button>
    </motion.div>
  );
};
