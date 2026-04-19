import { cn } from "@/lib/utils";

export const getCellContainerStyles = (
  isXl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
) => {
  void expandedHeight;
  return {
    zIndex: isHovered && isXl ? 10 : 1,
    position: "relative" as const,
    ...(isXl && { height: "315px" }),
  };
};

export const getButtonStyles = (
  isXl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
  dayEvents: unknown[],
) => {
  void expandedHeight;
  void dayEvents;
  return {
    width: "100%",
    height: isXl ? "315px" : "auto",
    position: "relative" as const,
    zIndex: isHovered && isXl ? 10 : 1,
  };
};

export const getButtonClassName = (
  isXl: boolean,
  is2xl: boolean,
  isHovered: boolean,
  dayEvents: unknown[],
  isCurrentMonth: boolean,
) => {
  return cn(
    "flex flex-col text-left",
    is2xl ? "px-6 py-6" : isXl ? "px-4 py-6" : "p-1",
    "h-auto min-h-[62px] sm:min-h-[117px] md:min-h-[159px] xl:min-h-[315px]",
    isHovered && isXl
      ? "bg-main text-white"
      : dayEvents.length === 0
        ? "bg-[#F7F6F5] text-black"
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
  void isHovered;
  void isOverflowing;
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
