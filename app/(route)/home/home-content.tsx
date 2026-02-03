"use client";

import { useState, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  getCalendarEventsOptions,
  getPerformancesOptions,
} from "@/app/feature/home/query-options";
import { getDateRange } from "@/app/feature/home/utils/get-date-range";
import { getQueryParams } from "@/app/feature/home/utils/get-query-params";
import PageWrapper from "@/app/shared/components/page-wrapper";
import CustomCalendar from "@/components/shared/calendar/custom-calendar";
import { convertCalendarEvents } from "@/app/(route)/home/utils/convert-calendar-events";
import { useResponsive } from "@/components/shared/calendar/hooks/use-responsive";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { cn } from "@/lib/utils";

import HeroSection from "@/app/feature/home/components/hero-section";
import CharacterSection from "@/app/feature/home/components/character-section";
import MainContent from "@/app/feature/home/components/main-content";
import MobileBottomNavigation from "@/app/feature/home/components/mobile-bottom-navigation";
import SelectCalendarViewHeader from "@/components/shared/select-calendar-view-header";
import Footer from "@/app/shared/components/footer";

export default function HomeContent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentMonthKey = format(currentMonth, "yyyy-MM");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const calendarEventsQueryOptions = useMemo(
    () => getCalendarEventsOptions(currentMonthKey),
    [currentMonthKey]
  );

  const { data: calendarEvents } = useQuery(calendarEventsQueryOptions);

  const isXl = useResponsive();
  const { selectedMobileBottomNavigation, selectedCategory, selectedArea } =
    useHomeStore();

  const { startDate, endDate } = getDateRange(selectedCategory);
  const { isFree, area } = getQueryParams(selectedCategory, selectedArea);

  const {
    data: performances,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    getPerformancesOptions(startDate, endDate, area, isFree)
  );

  const events = useMemo(() => {
    if (!calendarEvents) return {};
    return convertCalendarEvents(calendarEvents);
  }, [calendarEvents]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const shouldShowCalendar =
    isXl || selectedMobileBottomNavigation === "calendar";
  const shouldShowMainContent =
    isXl || selectedMobileBottomNavigation === "home";

  return (
    <>
      {shouldShowMainContent && (
        <PageWrapper>
          <HeroSection />
          <CharacterSection performances={performances} />
          <MainContent
            performances={performances}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </PageWrapper>
      )}

      <div
        className={cn("w-full xl:pt-30", !shouldShowCalendar && "hidden")}
        aria-hidden={!shouldShowCalendar}
      >
        <SelectCalendarViewHeader />
        <CustomCalendar
          events={events}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </div>
      <div className="xl:pt-35">
        <Footer />
      </div>

      <MobileBottomNavigation />
    </>
  );
}
