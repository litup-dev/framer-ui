"use client";

import SelectShow from "@/app/feature/home/components/select-show";
import CarouselCards from "@/app/feature/home/components/carousel";
import AllItemsGrid from "@/app/feature/home/components/all-items-grid";
import { useHomeStore } from "@/app/feature/home/store/home-store";

export default function MainContent() {
  const { selectedCategory, showAllItems, isAnimating, handleCategoryChange } =
    useHomeStore();

  return (
    <div className="flex gap-5 z-10">
      <div className="w-2/10">
        <SelectShow
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          isAnimating={isAnimating}
        />
      </div>
      <div className="w-8/10">
        {showAllItems ? <AllItemsGrid /> : <CarouselCards />}
      </div>
    </div>
  );
}
