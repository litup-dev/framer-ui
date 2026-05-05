"use client";

import Image from "next/image";
import { useHomeStore } from "@/app/feature/home/store/home-store";
import { cn } from "@/lib/utils";

const CALENDAR_VIEW_OPTIONS = [
  {
    id: 1,
    value: "calendar" as const,
    activeImage: "/images/calendar_view_active.png",
    inactiveImage: "/images/calendar_view_inactive.png",
  },
  {
    id: 2,
    value: "list" as const,
    activeImage: "/images/calendar_view_list_active.png",
    inactiveImage: "/images/calendar_view_list_inactive.png",
  },
];

const SelectCalendarViewHeader = () => {
  const { calendarView, setCalendarView } = useHomeStore();

  return (
    <div
      className={cn(
        "pl-5 pr-2 md:pr-[28px] lg:pr-[51px] xl:hidden flex items-center justify-end",
        calendarView === "calendar" && "pb-[7px] md:pb-[16px] lg:pb-[28px]",
      )}
    >
      <div className="h-[48px] flex items-center justify-end  mb-[0px] lg:mb-0">
        {CALENDAR_VIEW_OPTIONS.map((option) => {
          const isActive = calendarView === option.value;
          return (
            <button
              key={option.id}
              onClick={() => setCalendarView(option.value)}
              className="cursor-pointer w-12 h-12 flex items-center justify-center"
            >
              <Image
                src={isActive ? option.activeImage : option.inactiveImage}
                alt={option.value}
                width={32}
                height={32}
                className="w-8 h-8 lg:w-10 lg:h-10"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectCalendarViewHeader;
