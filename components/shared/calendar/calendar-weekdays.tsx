"use client";

import { cn } from "@/lib/utils";
import { Title } from "@/components/shared/typography";

interface CalendarWeekdaysProps {
  isXl: boolean;
}

export const CalendarWeekdays = ({ isXl }: CalendarWeekdaysProps) => {
  const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <div className="flex gap-0 mb-2 px-5 xl:px-20">
      {weekdays.map((day) => (
        <div
          key={day}
          className={cn("flex-1", isXl && "w-[250px] flex-shrink-0")}
        >
          <Title className="text-start pl-4 text-black text-[12px] xl:text-[24px]">
            {day}
          </Title>
        </div>
      ))}
    </div>
  );
};
