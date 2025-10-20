"use client";

import { useHomeStore } from "@/app/feature/home/store/home-store";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: 1, value: "home" },
  { id: 2, value: "calendar" },
];

const MobileBottomNavigation = () => {
  const { selectedMobileBottomNavigation, setSelectedMobileBottomNavigation } =
    useHomeStore();

  return (
    <div
      className={cn(
        "sm:hidden fixed cursor-pointer bottom-0 left-0 right-0 z-50 bg-white shadow-lg max-w-2xl m-auto border-t-1 h-[64px] flex items-center justify-center gap-20"
      )}
    >
      {navigationItems.map((item) => (
        <div
          key={item.id}
          onClick={() =>
            setSelectedMobileBottomNavigation(item.value as "home" | "calendar")
          }
          className={`text-title-16 ${
            selectedMobileBottomNavigation === item.value
              ? "text-black"
              : "text-gray"
          }`}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default MobileBottomNavigation;
