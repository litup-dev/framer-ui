"use client";

import { useRef } from "react";

interface UseCalendarCellScrollProps {
  isHovered: boolean;
  isXl: boolean;
}

export const useCalendarCellScroll = (
  _props: UseCalendarCellScrollProps,
) => {
  const eventsContainerRef = useRef<HTMLDivElement>(null);
  return eventsContainerRef;
};

