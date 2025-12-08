"use client";

import Image from "next/image";
import { useHomeStore } from "@/app/feature/home/store/home-store";

const CALENDAR_VIEW_OPTIONS = [
  {
    id: 1,
    value: "calendar" as const,
    activeImage: "/images/calendar_view_active.svg",
    inactiveImage: "/images/calendar_view_inactive.svg",
  },
  {
    id: 2,
    value: "list" as const,
    activeImage: "/images/calendar_view_list_active.svg",
    inactiveImage: "/images/calendar_view_list_inactive.svg",
  },
];

const SelectCalendarViewHeader = () => {
  const { calendarView, setCalendarView } = useHomeStore();

  return (
    <div className="px-2 md:hidden">
      <div className="h-[48px] flex items-center justify-end">
        {CALENDAR_VIEW_OPTIONS.map((option) => {
          const isActive = calendarView === option.value;
          return (
            <button
              key={option.id}
              onClick={() => setCalendarView(option.value)}
              className="cursor-pointer"
            >
              <Image
                src={isActive ? option.activeImage : option.inactiveImage}
                alt={option.value}
                width={48}
                height={48}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectCalendarViewHeader;
