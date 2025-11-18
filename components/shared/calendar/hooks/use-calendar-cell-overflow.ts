"use client";

import { useState, useEffect, RefObject } from "react";

interface UseCalendarCellOverflowProps {
  isHovered: boolean;
  dayEvents: unknown[];
  dayNumber: number;
  eventsContainerRef: RefObject<HTMLDivElement | null>;
}

export const useCalendarCellOverflow = ({
  isHovered,
  dayEvents,
  dayNumber,
  eventsContainerRef,
}: UseCalendarCellOverflowProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!isHovered && eventsContainerRef.current) {
      const checkOverflow = () => {
        const element = eventsContainerRef.current;
        if (element) {
          const overflowing = element.scrollHeight > element.clientHeight;
          setIsOverflowing(overflowing);
        }
      };

      checkOverflow();
      const timeoutId = setTimeout(checkOverflow, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setIsOverflowing(false);
    }
  }, [dayEvents, isHovered, dayNumber, eventsContainerRef]);

  return isOverflowing;
};

