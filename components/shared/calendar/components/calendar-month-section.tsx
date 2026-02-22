"use client";

import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { parse, format } from "date-fns";
import { CalendarEvent } from "@/components/shared/calendar/types";
import CalendarDateEventList from "./calendar-date-event-list";
import { Description, Title } from "../../typography";

interface CalendarMonthSectionProps {
  month: string;
  events: Record<string, CalendarEvent[]>;
  onDateSelect: (date: Date) => void;
  onInView?: () => void;
}

const CalendarMonthSection = ({
  month,
  events,
  onDateSelect,
  onInView,
}: CalendarMonthSectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && onInView) {
      onInView();
    }
  }, [inView, onInView]);

  const formattedMonth = useMemo(() => {
    try {
      const date = parse(month, "yyyy-MM", new Date());
      return format(date, "MMMM");
    } catch {
      return month;
    }
  }, [month]);

  const sortedDates = Object.keys(events).sort();

  return (
    <div ref={ref} className="min-h-[200px] px-5  md:px-10 flex flex-col gap-6">
      <Title className="text-[38px] leading-0 pb-6">
        {formattedMonth.toLowerCase()}
      </Title>
      {sortedDates.length > 0 ? (
        <div className="space-y-5">
          {sortedDates.map((dateKey) => (
            <CalendarDateEventList
              key={dateKey}
              dateKey={dateKey}
              events={events[dateKey]}
              onDateSelect={onDateSelect}
            />
          ))}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center">
          <Description className="text-[14px] text-black/40">
            등록된 공연이 없습니다.
          </Description>
        </div>
      )}
    </div>
  );
};

export default CalendarMonthSection;
