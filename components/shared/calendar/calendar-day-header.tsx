"use client";

import { cn } from "@/lib/utils";
import { Title } from "@/components/shared/typography";

interface CalendarDayHeaderProps {
  dayNumber: number;
  isXl: boolean;
  isSelected: boolean;
  isTodayDate: boolean;
  isHovered: boolean;
  hasImage: boolean;
}

export const CalendarDayHeader = ({
  dayNumber,
  isXl,
  isSelected,
  isTodayDate,
  isHovered,
  hasImage,
}: CalendarDayHeaderProps) => {
  return (
    <div
      className={cn(
        "xl:flex xl:items-center relative",
        isXl ? "justify-between xl:mb-10 z-50" : "justify-center z-10",
      )}
    >
      <div
        className={cn(
          !isXl &&
            "rounded-full w-6 h-6 md:w-8.5 md:h-8.5 flex items-center justify-center min-w-6",
          !isXl && isSelected && "bg-main",
          !isXl && isTodayDate && !isSelected && "bg-[#AECACD]",
          !isXl && !isSelected && !isTodayDate && hasImage && "bg-black-60",
        )}
      >
        <Title
          className={cn(
            "text-[12px] md:text-[16px] xl:text-[16px] 2xl:text-[20px]",
            !isXl && hasImage
              ? "text-white"
              : !isXl && (isSelected || isTodayDate)
                ? "text-white"
                : isHovered && isXl
                  ? "text-white xl:text-white"
                  : !isXl && !hasImage && "text-gray xl:text-black",
          )}
        >
          {dayNumber}
        </Title>
      </div>
      {isTodayDate && isXl && (
        <div
          className={cn(
            "leading-4",
            isHovered && isXl ? "bg-transparent" : "bg-[#AECACD]",
          )}
        >
          <Title
            className={cn(
              "text-black  xl:text-[16px] 2xl:text-[20px]",
              isHovered && isXl ? "text-white" : "text-black",
            )}
          >
            today
          </Title>
        </div>
      )}
    </div>
  );
};
