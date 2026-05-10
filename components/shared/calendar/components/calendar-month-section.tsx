"use client";

import { useMemo } from "react";
import { parse, format } from "date-fns";
import { CalendarEvent } from "@/components/shared/calendar/types";
import CalendarDateEventList from "./calendar-date-event-list";
import { Description, Title } from "../../typography";

interface CalendarMonthSectionProps {
  month: string;
  events: Record<string, CalendarEvent[]>;
  onDateSelect: (date: Date) => void;
}

const CalendarMonthSection = ({
  month,
  events,
  onDateSelect,
}: CalendarMonthSectionProps) => {
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
    <div className="min-h-[200px] px-5 md:px-10 lg:px-15 flex flex-col gap-6">
      <Title className="text-[30px] tracking-[-2.4px] md:text-[42px] md:tracking-[-3.36px] leading-[30px] pb-2 md:pb-6 lg:pb-10">
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
