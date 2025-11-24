"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCalendarEventsListOptions } from "@/app/feature/home/query-options";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { convertCalendarEvents } from "@/app/(route)/home/utils/convert-calendar-events";
import CalendarMonthSection from "./components/calendar-month-section";
import CalendarListLoading from "./components/calendar-list-loading";

interface CalendarListViewProps {
  onDateSelect?: (date: Date) => void;
}

const CalendarListView = ({ onDateSelect }: CalendarListViewProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(getCalendarEventsListOptions());

  const loadedMonths = useMemo(() => {
    const months: string[] = [];
    if (!data) return months;
    data.pages.forEach((page) => {
      if (page.month) {
        months.push(page.month);
      }
    });
    return months;
  }, [data]);

  const monthDataMap = useMemo(() => {
    const map = new Map<string, Record<string, CalendarEvent[]>>();
    if (!data) return map;
    data.pages.forEach((page) => {
      if (page.month && page.data) {
        const converted = convertCalendarEvents(page.data);
        map.set(page.month, converted);
      }
    });
    return map;
  }, [data]);

  const handleLastMonthInView = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-12">
        {loadedMonths.map((month, index) => {
          const isLastMonth = index === loadedMonths.length - 1;
          return (
            <CalendarMonthSection
              key={month}
              month={month}
              events={monthDataMap.get(month) || {}}
              onDateSelect={onDateSelect ?? (() => {})}
              onInView={isLastMonth ? handleLastMonthInView : undefined}
            />
          );
        })}
      </div>
      {isFetchingNextPage && <CalendarListLoading />}
    </div>
  );
};

export default CalendarListView;
