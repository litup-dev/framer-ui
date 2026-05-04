"use client";

import { cn } from "@/lib/utils";
import { Title } from "@/components/shared/typography";

interface CalendarDayHeaderProps {
  dayNumber: number;
  isXl: boolean;
  is2xl: boolean;
  isSelected: boolean;
  isTodayDate: boolean;
  isHovered: boolean;
  hasImage: boolean;
}

export const CalendarDayHeader = ({
  dayNumber,
  isXl,
  is2xl,
  isSelected,
  isTodayDate,
  isHovered,
  hasImage,
}: CalendarDayHeaderProps) => {
  return (
    <div
      className={cn(
        "xl:flex xl:items-center relative",
        isXl
          ? cn("justify-between z-50", is2xl ? "xl:mb-10" : "xl:mb-8")
          : "justify-center z-10",
      )}
    >
      <div
        className={cn(
          !isXl &&
            "rounded-full size-6 md:size-[34px] shrink-0 aspect-square flex items-center justify-center",
          !isXl && isSelected && "bg-main",
          !isXl && isTodayDate && "bg-main",
          !isXl && !isSelected && !isTodayDate && hasImage && "bg-black-60",
        )}
      >
        <Title
          as="span"
          className={cn(
            "block text-[12px] md:text-[16px] xl:text-[16px] 2xl:text-[20px]",
            !isXl && "leading-6 md:leading-[34px] text-center",
            isTodayDate && isXl && !isHovered
              ? "text-black"
              : isTodayDate
                ? "text-white"
                : !isXl && hasImage
                  ? "text-white"
                  : !isXl && isSelected
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
          className={cn("leading-4", isHovered && isXl ? "bg-transparent" : "")}
        >
          <Title
            className={cn(
              "text-white  xl:text-[16px] 2xl:text-[20px]",
              isHovered && isXl ? "text-main bg-white" : "text-main",
            )}
          >
            today
          </Title>
        </div>
      )}
    </div>
  );
};
