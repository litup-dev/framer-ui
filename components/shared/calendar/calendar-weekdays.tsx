"use client";

import { cn } from "@/lib/utils";
import { Title } from "@/components/shared/typography";

interface CalendarWeekdaysProps {
  is2xl: boolean;
}

export const CalendarWeekdays = ({ is2xl }: CalendarWeekdaysProps) => {
  const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-0 pt-1.5 pb-1.5 md:pb-0 md:pt-0 mb-2 md:mb-4 px-5 md:px-10 lg:pt-[12px] lg:pb-[8px]",
        is2xl ? "lg:px-15 2xl:px-20" : "lg:px-15",
      )}
    >
      {weekdays.map((day) => (
        <div key={day} className="relative">
          <Title
            className={cn(
              "text-center xl:text-start text-black text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px]",
              "pl-1 lg:pl-0 xl:pl-4 2xl:pl-6",
            )}
          >
            {day}
          </Title>
        </div>
      ))}
    </div>
  );
};
