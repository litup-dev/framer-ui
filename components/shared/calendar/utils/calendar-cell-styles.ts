import { cn } from "@/lib/utils";

const MAX_HOVER_HEIGHT_2XL = 560;
const MAX_HOVER_HEIGHT_XL = 340;

export const getCellHeights = (is2xl: boolean) => ({
  maxHover: is2xl ? MAX_HOVER_HEIGHT_2XL : MAX_HOVER_HEIGHT_XL,
});

export const getCellContainerStyles = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
) => {
  void is2xl;
  void expandedHeight;
  return {
    zIndex: isHovered && isXl ? 10 : 1,
    position: "relative" as const,
    height: "100%",
  };
};

export const getButtonStyles = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
) => {
  void is2xl;
  void expandedHeight;
  return {
    width: "100%",
    height: "100%",
    position: "relative" as const,
    zIndex: isHovered && isXl ? 10 : 1,
    overflow: "hidden" as const,
  };
};

export const getButtonClassName = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  dayEvents: unknown[],
  isCurrentMonth: boolean,
) => {
  void is2xl;
  return cn(
    "flex flex-col text-left",
    "p-1 xl:px-4 xl:pt-4 xl:pb-4 2xl:px-6 2xl:pt-6 2xl:pb-6",
    "min-h-[62px] sm:min-h-[117px] md:min-h-[159px]",
    "xl:transition-[max-height,height] xl:duration-300 xl:ease-out",
    !isHovered &&
      "xl:!h-[209px] xl:!max-h-[209px] 2xl:!h-[314px] 2xl:!max-h-[314px]",
    isHovered &&
      isXl &&
      "xl:!absolute xl:!top-0 xl:!left-0 xl:!right-0 xl:!min-h-[209px] 2xl:!min-h-[314px] xl:!max-h-[340px] 2xl:!max-h-[560px] xl:!overflow-y-auto calendar-cell-scroll",
    isHovered && isXl
      ? "bg-main text-white"
      : dayEvents.length === 0
        ? "bg-transparent text-black"
        : "bg-white text-black",
    !isCurrentMonth && "opacity-50",
  );
};

export const getEventsContainerClassName = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  isCurrentMonth: boolean,
  isOverflowing: boolean,
) => {
  void isOverflowing;
  void isHovered;
  return cn(
    "flex flex-col relative z-10",
    is2xl ? "gap-10" : "gap-8",
    isXl ? "flex-1 min-h-0" : "hidden",
    !isCurrentMonth && "opacity-50",
  );
};

export const getEventsContainerStyles = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  isOverflowing: boolean,
) => {
  void is2xl;
  return {
    width: "100%",
    boxSizing: "border-box" as const,
    maskImage:
      !isHovered && isXl && isOverflowing
        ? "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)"
        : "none",
    WebkitMaskImage:
      !isHovered && isXl && isOverflowing
        ? "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)"
        : "none",
  };
};
