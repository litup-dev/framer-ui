"use client";

import { useHomeStore } from "@/app/feature/home/store/home-store";
import { Title } from "@/components/shared/typography";
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
        "xl:hidden fixed cursor-pointer bottom-0 left-0 right-0 z-50 bg-white shadow-lg w-full m-auto border-t-1 h-[64px] flex pt-4 justify-center gap-20"
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
          <Title className="text-[16px]">{item.value}</Title>
        </div>
      ))}
    </div>
  );
};

export default MobileBottomNavigation;
