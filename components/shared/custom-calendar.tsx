"use client";

import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  getDate,
} from "date-fns";
import { Plus } from "lucide-react";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

import { Subtitle, Title } from "@/components/shared/typography";
import Image from "next/image";

export interface CalendarEvent {
  id: string;
  venue: string;
  artists: string[];
}

interface CustomCalendarProps {
  events?: Record<string, CalendarEvent[]>;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  maxEventsPerDay?: number;
}

interface CalendarDayCellProps {
  day: Date;
  dayEvents: CalendarEvent[];
  isCurrentMonth: boolean;
  isHovered: boolean;
  isTodayDate: boolean;
  dayNumber: number;
  isXl: boolean;
  maxEventsPerDay: number;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

const CalendarDayCell = ({
  day,
  dayEvents,
  isCurrentMonth,
  isHovered,
  isTodayDate,
  dayNumber,
  isXl,
  maxEventsPerDay,
  onDateClick,
  onMouseEnter,
  onMouseLeave,
}: CalendarDayCellProps) => {
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isHovered || !eventsContainerRef.current) return;

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
  }, [isHovered]);

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
    if (isHovered && buttonRef.current) {
      setIsAnimating(true);
      const button = buttonRef.current;
      const tempHeight = button.style.height;
      button.style.height = "auto";
      const actualHeight = button.scrollHeight;
      button.style.height = tempHeight;
      setExpandedHeight(actualHeight);
    } else if (!isHovered && expandedHeight !== null) {
      setIsAnimating(true);
      // expandedHeight는 애니메이션 완료 후에만 리셋
    }
  }, [isHovered]);

  return (
    <div
      className="relative"
      style={{
        zIndex: isHovered ? 88888 : 1,
        height: isXl ? "315px" : "200px",
        width: isXl ? "250px" : "100%",
      }}
    >
      <motion.button
        ref={buttonRef}
        onClick={() => onDateClick(day)}
        onMouseEnter={() => onMouseEnter(day)}
        onMouseLeave={onMouseLeave}
        className={cn(
          "p-4 flex flex-col text-left",
          isHovered
            ? "bg-main text-white"
            : dayEvents.length === 0
            ? "bg-gray text-black"
            : "bg-white text-black",
          !isCurrentMonth && "opacity-50"
        )}
        initial={false}
        animate={{
          height:
            isHovered && expandedHeight
              ? expandedHeight
              : expandedHeight !== null && !isHovered
              ? isXl
                ? 315
                : 200
              : isXl
              ? 315
              : 200,
        }}
        transition={{
          height: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
        onAnimationComplete={() => {
          if (!isHovered && expandedHeight !== null) {
            setIsAnimating(false);
            setExpandedHeight(null);
          } else if (isHovered) {
            setIsAnimating(false);
          }
        }}
        style={{
          width: isXl ? "250px" : "100%",
          minHeight: isXl ? "315px" : "200px",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: isHovered ? 88888 : 1,
          willChange: isHovered ? "height" : "auto",
        }}
      >
        <div className="flex items-center justify-between xl:mb-10">
          <Title
            className={cn(
              "text-black xl:text-[20px]",
              isHovered ? "text-white" : "text-black"
            )}
          >
            {dayNumber}
          </Title>
          {isTodayDate && (
            <Title
              className={cn(
                "text-black xl:text-[20px]",
                isHovered ? "text-white" : "text-black"
              )}
            >
              today
            </Title>
          )}
        </div>

        {dayEvents.length > 0 && (
          <>
            <div
              ref={eventsContainerRef}
              className={cn(
                "flex flex-col gap-1 text-xs transition-all duration-300 space-y-8 relative scrollbar-custom",
                isHovered
                  ? "max-h-[560px] overflow-y-auto -mt-[120px] pt-[120px]"
                  : "max-h-[315px] overflow-hidden mt-1",
                !isCurrentMonth && "opacity-50"
              )}
              style={{
                width: isXl ? (isHovered ? "230px" : "250px") : "100%",
                boxSizing: "border-box",
                paddingRight: isHovered ? "0" : "0",
                marginRight: isHovered ? "0" : "0",
                maskImage: isHovered
                  ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%)"
                  : "none",
                WebkitMaskImage: isHovered
                  ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%)"
                  : "none",
                scrollbarWidth: isHovered ? "thin" : "none",
                scrollbarColor: isHovered
                  ? "rgba(0, 0, 0, 0.2) transparent"
                  : "transparent transparent",
              }}
            >
              {dayEvents.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={cn(
                    "flex flex-col gap-2.5",
                    isHovered ? "text-white" : "text-black"
                  )}
                >
                  <div>
                    <Title
                      className={cn(
                        "text-black xl:text-[20px]",
                        isHovered ? "text-white" : "text-black"
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
                            isHovered ? "text-white" : "text-black"
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
            <AnimatePresence>
              {!isHovered && isOverflowing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 right-4 flex items-center justify-end"
                >
                  <Plus className="w-6 h-6 text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.button>
    </div>
  );
};

const CustomCalendar = ({
  events = {},
  onDateSelect,
  selectedDate,
  maxEventsPerDay = 4,
}: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const checkXl = () => {
      setIsXl(window.innerWidth >= 1280);
    };
    checkXl();
    window.addEventListener("resize", checkXl);
    return () => window.removeEventListener("resize", checkXl);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const handleMouseEnter = (date: Date) => {
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return events[dateKey] || [];
  };

  const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <div className="w-screen bg-gray relative pb-[388px]">
      <div className="flex items-center xl:px-20 pb-25">
        <Title className="text-black leading-5 xl:text-[96px]">calendar</Title>
        <div className="absolute top-5 left-120 self-end gap-5 flex items-center">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="이전 달"
          >
            <Image
              src="/images/arrow-left.svg"
              alt="arrow-left"
              width={24}
              height={24}
            />
          </button>
          <Subtitle className="text-black xl:text-[24px]">
            {format(currentMonth, "M월", { locale: ko })}
          </Subtitle>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="다음 달"
          >
            <Image
              src="/images/arrow-right.svg"
              alt="arrow-right"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-2 px-20">
        {weekdays.map((day) => (
          <Title
            key={day}
            className="text-start pl-4 text-black xl:text-[24px]"
          >
            {day}
          </Title>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0 relative px-20">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isHovered = hoveredDate && isSameDay(day, hoveredDate);
          const isTodayDate = isToday(day);
          const dayNumber = getDate(day);

          return (
            <CalendarDayCell
              key={`${format(day, "yyyy-MM-dd")}-${index}`}
              day={day}
              dayEvents={dayEvents}
              isCurrentMonth={isCurrentMonth}
              isHovered={!!isHovered}
              isTodayDate={isTodayDate}
              dayNumber={dayNumber}
              isXl={isXl}
              maxEventsPerDay={maxEventsPerDay}
              onDateClick={handleDateClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
