"use client";

import { useState, useMemo } from "react";
import PageWrapper from "@/app/shared/components/page-wrapper";
import CustomCalendar from "@/components/shared/custom-calendar";
import { mockCalendarEvents } from "@/app/(route)/home/data/mock-calendar-events";
import { convertCalendarEvents } from "@/app/(route)/home/utils/convert-calendar-events";

import HeroSection from "@/app/feature/home/components/hero-section";
import CharacterSection from "@/app/feature/home/components/character-section";
import MainContent from "@/app/feature/home/components/main-content";
import MobileBottomNavigation from "@/app/feature/home/components/mobile-bottom-navigation";
import Footer from "@/app/shared/components/footer";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const events = useMemo(() => {
    return convertCalendarEvents(mockCalendarEvents);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <PageWrapper>
        <HeroSection />
        <CharacterSection />
        <MainContent />
      </PageWrapper>
      <div className="container w-full pt-30">
        <CustomCalendar
          events={events}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          maxEventsPerDay={4}
        />
      </div>
      <Footer />
      <MobileBottomNavigation />
    </div>
  );
}
