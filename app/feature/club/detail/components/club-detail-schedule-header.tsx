"use client";

import { format, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Subtitle } from "@/components/shared/typography";

interface ClubDetailScheduleHeaderProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

const ClubDetailScheduleHeader = ({
  currentMonth,
  onMonthChange,
}: ClubDetailScheduleHeaderProps) => {
  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex items-center justify-between sm:justify-start sm:gap-4 border-b-2 border-main pb-3">
      <div className="flex gap-1 items-center">
        <Image
          src="/images/review_calendar.svg"
          alt="calendar"
          width={32}
          height={32}
          className="w-6 h-6 2xl:w-8 2xl:h-8"
        />
        <Subtitle className="text-[18px] sm:text-[20px] xl:text-[24px]">
          공연 일정
        </Subtitle>
      </div>
      <div className="flex items-center text-black-60">
        <button
          onClick={handlePrevMonth}
          className="hover:bg-gray-100 rounded transition-colors"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Subtitle className="text-[16px] xl:text-[20px] text-black-60 min-w-[100px] xl:min-w-[120px] text-center">
          {format(currentMonth, "yyyy년 M월", { locale: ko })}
        </Subtitle>
        <button
          onClick={handleNextMonth}
          className="hover:bg-gray-100 rounded transition-colors"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ClubDetailScheduleHeader;
