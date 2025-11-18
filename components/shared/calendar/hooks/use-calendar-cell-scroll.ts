"use client";

import { useEffect, useRef } from "react";

interface UseCalendarCellScrollProps {
  isHovered: boolean;
  isXl: boolean;
}

export const useCalendarCellScroll = ({
  isHovered,
  isXl,
}: UseCalendarCellScrollProps) => {
  const eventsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHovered || !isXl || !eventsContainerRef.current) return;

    const container = eventsContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isHovered, isXl]);

  return eventsContainerRef;
};

