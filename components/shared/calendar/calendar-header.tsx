"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Subtitle, Title } from "@/components/shared/typography";
import SelectCalendarViewHeader from "../select-calendar-view-header";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  is2xl?: boolean;
}

export const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  is2xl = false,
}: CalendarHeaderProps) => {
  return (
    <div
      className={cn(
        "relative flex items-center xl:items-baseline justify-between xl:justify-start px-5 pb-10 md:pb-18 xl:pb-25",
        is2xl ? "xl:gap-6 xl:px-20" : "xl:gap-4 xl:px-15",
      )}
    >
      <Title
        className={cn(
          "absolute xl:static mt-2.5 text-black text-[38px] md:text-[48px]",
          is2xl ? "xl:text-[84px] xl:-mt-8" : "xl:text-[56px] xl:-mt-6",
        )}
      >
        calendar
      </Title>
      <div className="flex items-center absolute xl:static right-1 md:left-[180px] top-[-5px] md:top-[0px] xl:top-auto xl:left-auto gap-1 xl:gap-4">
        <button
          onClick={onPrevMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="이전 달"
        >
          <Image
            src="/images/arrow-left.svg"
            alt="arrow-left"
            width={24}
            height={24}
          />
        </button>
        <Subtitle className="text-black text-[16px] xl:text-[24px]">
          {format(currentMonth, "M월", { locale: ko })}
        </Subtitle>
        <button
          onClick={onNextMonth}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          aria-label="다음 달"
        >
          <Image
            src="/images/arrow-right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};
