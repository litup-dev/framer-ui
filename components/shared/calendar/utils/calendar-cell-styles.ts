import { cn } from "@/lib/utils";

export const getCellContainerStyles = (
  isXl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
) => {
  return {
    zIndex: isHovered && isXl ? 10 : 1,
    position: (isXl && isHovered ? "absolute" : "relative") as
      | "absolute"
      | "relative",
    ...(isXl &&
      isHovered && {
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
      }),
    ...(isXl &&
      !isHovered && {
        height: "315px",
      }),
    ...(isXl &&
      isHovered &&
      expandedHeight && {
        height: `${expandedHeight}px`,
      }),
  };
};

export const getButtonStyles = (
  isXl: boolean,
  isHovered: boolean,
  expandedHeight: number | null,
  dayEvents: unknown[],
) => {
  return {
    width: "100%",
    height: isXl
      ? isHovered && expandedHeight
        ? `${expandedHeight}px`
        : "315px"
      : "auto",
    position: (isXl && isHovered ? "absolute" : "relative") as
      | "absolute"
      | "relative",
    ...(isXl && isHovered && { top: 0, left: 0, right: 0 }),
    zIndex: isHovered && isXl ? 10 : 1,
    transition: isXl ? "height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
  };
};

export const getButtonClassName = (
  isXl: boolean,
  isHovered: boolean,
  dayEvents: unknown[],
  isCurrentMonth: boolean,
) => {
  return cn(
    "flex flex-col text-left",
    isXl ? "px-6 pt-6" : "p-1",
    "h-auto min-h-[62px] sm:min-h-[117px] md:min-h-[159px] xl:min-h-[315px]",
    isHovered && isXl
      ? "bg-main text-white pb-6"
      : dayEvents.length === 0
        ? "bg-[#F7F6F5] text-black"
        : "bg-white text-black",
    !isCurrentMonth && "opacity-50",
  );
};

export const getEventsContainerClassName = (
  isXl: boolean,
  isHovered: boolean,
  isCurrentMonth: boolean,
  isOverflowing: boolean,
) => {
  return cn(
    "flex flex-col relative",
    isHovered && isXl
      ? cn(
          "gap-10 scrollbar scrollbar-w-[5px] scrollbar-track-transparent scrollbar-thumb-black/20 hover:scrollbar-thumb-black/30 scrollbar-thumb-rounded-none scrollbar-track-rounded-none scrollbar-thumb-min-100 z-10",
          isOverflowing && "max-h-[560px] overflow-y-auto",
        )
      : isXl
        ? "h-[315px] overflow-hidden gap-10 z-10"
        : "hidden",
    !isCurrentMonth && "opacity-50",
  );
};

export const getEventsContainerStyles = (
  isXl: boolean,
  isHovered: boolean,
  isOverflowing: boolean,
) => {
  return {
    width: isXl ? "calc(100% + 48px)" : "100%",
    boxSizing: "border-box" as const,
    paddingLeft: isHovered && isXl ? "24px" : "0",
    paddingRight: isHovered && isXl ? "24px" : "0",
    marginRight: isHovered && isXl ? "-24px" : "0",
    marginLeft: isHovered && isXl ? "-24px" : "0",
    marginTop:
      isHovered && isXl
        ? "calc(-1 * (24px + 28px + 40px + 32px + 8px))"
        : undefined,
    paddingTop:
      isHovered && isXl ? "calc(24px + 28px + 40px + 32px + 8px)" : undefined,
    paddingBottom: isHovered && isXl ? "16px" : undefined,
    maskImage:
      isHovered && isXl
        ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 20%, black 100%)"
        : !isHovered && isXl && isOverflowing
          ? "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)"
          : "none",
    WebkitMaskImage:
      isHovered && isXl
        ? "linear-gradient(to bottom, transparent 0%, transparent 10%, black 30%, black 100%)"
        : !isHovered && isXl && isOverflowing
          ? "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)"
          : "none",
  };
};
