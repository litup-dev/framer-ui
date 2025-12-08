"use client";

import { useHomeStore } from "@/app/feature/home/store/home-store";

import SelectShow from "@/app/feature/home/components/select-show";
import MobileMainContent from "@/app/feature/home/components/mobile-main-content";
import DesktopMainContent from "@/app/feature/home/components/desktop-main-content";

export default function MainContent() {
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
    <div className="flex flex-col md:flex-row gap-5 z-10">
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
        <DesktopMainContent showAllItems={showAllItems} />
      </div>
    </div>
  );
}
