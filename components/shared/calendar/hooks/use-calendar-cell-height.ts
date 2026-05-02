"use client";

import { useState, useEffect, RefObject } from "react";
import { getCellHeights } from "@/components/shared/calendar/utils/calendar-cell-styles";

interface UseCalendarCellHeightProps {
  isHovered: boolean;
  isXl: boolean;
  is2xl: boolean;
  dayEvents: unknown[];
  buttonRef: RefObject<HTMLButtonElement | null>;
  divRef: RefObject<HTMLDivElement | null>;
}

export const useCalendarCellHeight = ({
  isHovered,
  isXl,
  is2xl,
  dayEvents,
  buttonRef,
  divRef,
}: UseCalendarCellHeightProps) => {
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);

  useEffect(() => {
    void divRef;
    if (!isHovered || !isXl || !buttonRef.current) {
      setExpandedHeight(null);
      return;
    }

    const { maxHover } = getCellHeights(is2xl);

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
  }, [isHovered, isXl, is2xl, dayEvents, buttonRef, divRef]);

  return expandedHeight;
};
