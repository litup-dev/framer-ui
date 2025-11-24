"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { getCalendarEventsOptions } from "@/app/feature/home/query-options";
import PageWrapper from "@/app/shared/components/page-wrapper";
import CustomCalendar from "@/components/shared/calendar/custom-calendar";
import { convertCalendarEvents } from "@/app/(route)/home/utils/convert-calendar-events";
import { useResponsive } from "@/components/shared/calendar/hooks/use-responsive";
import { useHomeStore } from "@/app/feature/home/store/home-store";

import HeroSection from "@/app/feature/home/components/hero-section";
import CharacterSection from "@/app/feature/home/components/character-section";
import MainContent from "@/app/feature/home/components/main-content";
import MobileBottomNavigation from "@/app/feature/home/components/mobile-bottom-navigation";
import SelectCalendarViewHeader from "@/components/shared/select-calendar-view-header";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const currentMonthKey = format(currentMonth, "yyyy-MM");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { data: calendarEvents } = useQuery(
    getCalendarEventsOptions(currentMonthKey)
  );

  const isXl = useResponsive();
  const { selectedMobileBottomNavigation } = useHomeStore();

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
          <CharacterSection />
          <MainContent />
        </PageWrapper>
      )}

      {shouldShowCalendar && (
        <div className="w-full xl:pt-30">
          <SelectCalendarViewHeader />
          <CustomCalendar
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
      )}
      <MobileBottomNavigation />
    </>
  );
}
