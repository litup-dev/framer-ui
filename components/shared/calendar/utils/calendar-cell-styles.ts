import { cn } from "@/lib/utils";

export const getCellContainerStyles = (isXl: boolean, isHovered: boolean) => ({
  zIndex: isHovered && isXl ? 10 : 1,
  position: "relative" as const,
  height: "100%",
});

export const getButtonStyles = (isXl: boolean, isHovered: boolean) => ({
  width: "100%",
  height: "100%",
  position: "relative" as const,
  zIndex: isHovered && isXl ? 10 : 1,
  overflow: "hidden" as const,
});

export const getButtonClassName = (
  isXl: boolean,
  isHovered: boolean,
  dayEvents: unknown[],
  isCurrentMonth: boolean,
) => {
  return cn(
    "flex flex-col text-left",
    "p-0.5 md:p-2 lg:p-2 xl:px-4 xl:pt-4 xl:pb-4 2xl:px-6 2xl:pt-6 2xl:pb-6",
    "min-h-[62px] sm:min-h-[117px] md:min-h-[117px] lg:min-h-[159px]",
    "xl:transition-[max-height,height] xl:duration-300 xl:ease-out",
    !isHovered &&
      "xl:!h-[209px] xl:!max-h-[209px] 2xl:!h-[314px] 2xl:!max-h-[314px]",
    isHovered &&
      isXl &&
      "xl:!absolute xl:!top-0 xl:!left-0 xl:!right-0 xl:!min-h-[209px] 2xl:!min-h-[314px] xl:!max-h-[340px] 2xl:!max-h-[560px] xl:!overflow-y-auto xl:[overscroll-behavior:contain] calendar-cell-scroll",
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
  isHovered: boolean,
  isCurrentMonth: boolean,
) => {
  return cn(
    "flex flex-col relative z-10 xl:gap-5 2xl:gap-8",
    isXl ? (isHovered ? "" : "flex-1 min-h-0") : "hidden",
    !isCurrentMonth && "opacity-50",
  );
};

export const getEventsContainerStyles = (
  isXl: boolean,
  isHovered: boolean,
  isOverflowing: boolean,
) => ({
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
});
