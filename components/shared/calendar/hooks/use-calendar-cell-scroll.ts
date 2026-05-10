"use client";

import { useEffect, useRef, RefObject } from "react";

interface UseCalendarCellScrollProps {
  isHovered: boolean;
  isXl: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

export const useCalendarCellScroll = ({
  isHovered,
  isXl,
  buttonRef,
}: UseCalendarCellScrollProps) => {
  const eventsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isXl || isHovered) return;
    const button = buttonRef.current;
    if (!button) return;
    button.scrollTop = 0;
  }, [isHovered, isXl, buttonRef]);

  return eventsContainerRef;
};
