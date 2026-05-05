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
        "relative flex items-center md:items-start lg:items-start xl:items-baseline justify-between md:justify-start lg:justify-start px-5 md:px-10 pb-11 md:-mt-[0px] md:pb-[30px] lg:-mt-[4px] lg:pb-[26px] xl:mt-0 xl:pb-[78px] 2xl:pb-[124px]",
        is2xl ? "md:gap-4 lg:gap-6 lg:px-15 2xl:px-20" : "md:gap-4 lg:gap-6 lg:px-15 xl:gap-4",
      )}
    >
      <Title
        className={cn(
          "absolute md:static lg:static mt-2.5 text-black text-[30px] tracking-[-2.4px] leading-[22px] md:text-[48px]",
          "md:text-[42px] md:leading-[30px] md:tracking-[-3.36px] md:mt-[-6px]",
          "lg:text-[52px] lg:leading-[38px] lg:tracking-[-4.16px] lg:mt-[-24px]",
          is2xl
            ? "xl:text-[84px] xl:leading-[61px] xl:mt-[-20px]"
            : "xl:text-[56px] xl:leading-[40px] xl:mt-[-12px]",
        )}
      >
        calendar
      </Title>
      <div className="flex items-center absolute md:static lg:static right-1 md:left-auto top-[-5px] md:top-auto lg:top-auto lg:left-auto md:mt-[0px] lg:mt-[-8px] xl:mt-0 gap-1 xl:gap-4">
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
