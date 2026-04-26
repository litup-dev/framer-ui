"use client";

import { InfiniteData } from "@tanstack/react-query";
import { PerformanceItem } from "@/app/feature/home/types";
import { useHomeStore } from "@/app/feature/home/store/home-store";

import SelectShow from "@/app/feature/home/components/select-show";
import MobileMainContent from "@/app/feature/home/components/mobile-main-content";
import DesktopMainContent from "@/app/feature/home/components/desktop-main-content";

interface MainContentProps {
  performances?: InfiniteData<{
    data: PerformanceItem[];
    offset: number;
    hasMore: boolean;
    total: number;
  }>;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
}

export default function MainContent({
  performances,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: MainContentProps) {
  const {
    selectedCategory,
    showAllItems,
    isAnimating,
    handleCategoryChange,
    selectedMobileBottomNavigation,
    selectedArea,
    setSelectedArea,
  } = useHomeStore();

  return (
    <div className="flex flex-col md:flex-row gap-5 z-10 relative">
      <div className="w-full md:w-2/10">
        <SelectShow
          onCategoryChange={(value: "week" | "today" | "free" | "area") =>
            handleCategoryChange(value)
          }
          selectedCategory={selectedCategory}
          isAnimating={isAnimating}
          selectedArea={selectedArea}
          onAreaChange={(value: string) => setSelectedArea(value)}
        />
      </div>
      <div className="w-full md:w-8/10">
        <MobileMainContent
          selectedMobileBottomNavigation={selectedMobileBottomNavigation}
        />
        <DesktopMainContent
          showAllItems={showAllItems}
          performances={performances}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
        <div
          className="absolute top-0 hidden lg:block w-full h-[613px] bg-gradient-to-b from-transparent via-white/30 to-white/60 pointer-events-none -z-10"
          aria-hidden
        />
      </div>
    </div>
  );
}
