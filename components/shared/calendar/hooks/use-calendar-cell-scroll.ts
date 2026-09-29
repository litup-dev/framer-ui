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
    if (!isXl || isHovered) return;
    const eventsContainer = eventsContainerRef.current;
    if (!eventsContainer) return;
    eventsContainer.scrollTop = 0;
  }, [isHovered, isXl]);

  return eventsContainerRef;
};
