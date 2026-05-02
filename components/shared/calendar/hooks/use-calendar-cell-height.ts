"use client";

import { useState, useEffect, RefObject } from "react";
import { CALENDAR_HOVER_MAX_HEIGHT } from "@/components/shared/calendar/constants";

interface UseCalendarCellHeightProps {
  isHovered: boolean;
  isXl: boolean;
  is2xl: boolean;
  dayEvents: unknown[];
  buttonRef: RefObject<HTMLButtonElement | null>;
}

export const useCalendarCellHeight = ({
  isHovered,
  isXl,
  is2xl,
  dayEvents,
  buttonRef,
}: UseCalendarCellHeightProps) => {
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!isHovered || !isXl || !buttonRef.current) {
      setExpandedHeight(null);
      return;
    }

    const maxHover = is2xl
      ? CALENDAR_HOVER_MAX_HEIGHT["2xl"]
      : CALENDAR_HOVER_MAX_HEIGHT.xl;

    const measure = () => {
      const button = buttonRef.current;
      if (!button) return;
      const prevHeight = button.style.height;
      button.style.height = "auto";
      const actualHeight = button.scrollHeight;
      button.style.height = prevHeight;
      setExpandedHeight(Math.min(actualHeight, maxHover));
    };

    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    return () => cancelAnimationFrame(raf);
  }, [isHovered, isXl, is2xl, dayEvents, buttonRef]);

  return expandedHeight;
};
