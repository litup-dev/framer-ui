"use client";

import SelectShow from "@/app/feature/home/components/select-show";
import MobileMainContent from "@/app/feature/home/components/mobile-main-content";
import DesktopMainContent from "@/app/feature/home/components/desktop-main-content";
import { useHomeStore } from "@/app/feature/home/store/home-store";

export default function MainContent() {
  const {
    selectedCategory,
    showAllItems,
    isAnimating,
    handleCategoryChange,
    selectedMobileBottomNavigation,
  } = useHomeStore();

  return (
    <div className="flex flex-col md:flex-row gap-5 z-10">
      <div className="w-full md:w-2/10">
        <SelectShow
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          isAnimating={isAnimating}
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
