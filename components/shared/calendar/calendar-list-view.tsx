"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
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

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "300px 0px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasScrolledToTodayRef = useRef(false);

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

  useEffect(() => {
    if (hasScrolledToTodayRef.current) return;
    if (loadedMonths.length === 0) return;

    const todayKey = format(new Date(), "yyyy-MM-dd");

    requestAnimationFrame(() => {
      let target: Element | null = document.querySelector(
        `[data-date="${todayKey}"]`,
      );
      if (!target) {
        const all = document.querySelectorAll("[data-date]");
        for (const el of Array.from(all)) {
          const dk = el.getAttribute("data-date");
          if (dk && dk >= todayKey) {
            target = el;
            break;
          }
        }
      }
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "center" });
        hasScrolledToTodayRef.current = true;
      }
    });
  }, [loadedMonths.length]);

  return (
    <div className="w-full">
      <div className="space-y-12">
        {loadedMonths.map((month) => (
          <CalendarMonthSection
            key={month}
            month={month}
            events={monthDataMap.get(month) || {}}
            onDateSelect={onDateSelect ?? (() => {})}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      {isFetchingNextPage && <CalendarListLoading />}
    </div>
  );
};

export default CalendarListView;
