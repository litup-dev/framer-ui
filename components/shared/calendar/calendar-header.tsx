"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { Subtitle, Title } from "@/components/shared/typography";
import SelectCalendarViewHeader from "../select-calendar-view-header";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="relative flex items-center justify-between px-5 xl:px-20 pb-10 xl:pb-25">
      <Title className="absolute mt-2.5 xl:mt-5 text-black text-[38px] md:text-[48px] xl:text-[96px]">
        calendar
      </Title>
      <div className="flex items-center absolute right-1 md:left-[180px] top-[-5px] md:top-[-5px] xl:top-5 xl:left-120 gap-1 xl:gap-5">
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
