"use client";

import { cn } from "@/lib/utils";
import { Title } from "@/components/shared/typography";

interface CalendarWeekdaysProps {
  isXl: boolean;
  is2xl: boolean;
}

export const CalendarWeekdays = ({
  isXl,
  is2xl,
}: CalendarWeekdaysProps) => {
  const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <div
      className={cn(
        "grid grid-cols-7 gap-0 mb-2 px-5",
        is2xl ? "xl:px-20" : "xl:px-15",
      )}
    >
      {weekdays.map((day) => (
        <div key={day} className="relative">
          <Title
            className={cn(
              "text-center xl:text-start text-black text-[12px] md:text-[16px] xl:text-[20px] 2xl:text-[24px]",
              "pl-1 xl:pl-4 2xl:pl-6",
            )}
          >
            {day}
          </Title>
        </div>
      ))}
    </div>
  );
};
