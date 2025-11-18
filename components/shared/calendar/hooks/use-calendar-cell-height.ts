"use client";

import { useState, useEffect, RefObject } from "react";

interface UseCalendarCellHeightProps {
  isHovered: boolean;
  isXl: boolean;
  dayEvents: unknown[];
  buttonRef: RefObject<HTMLButtonElement | null>;
  divRef: RefObject<HTMLDivElement | null>;
}

const MAX_EXPAND_HEIGHT = 560;

export const useCalendarCellHeight = ({
  isHovered,
  isXl,
  dayEvents,
  buttonRef,
  divRef,
}: UseCalendarCellHeightProps) => {
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);

  useEffect(() => {
    if (isHovered && isXl && buttonRef.current && divRef.current) {
      const calculateHeight = () => {
        if (!buttonRef.current || !divRef.current) return;

        const button = buttonRef.current;
        const currentHeight = button.style.height;

        button.style.height = "auto";
        const actualHeight = button.scrollHeight;
        button.style.height = currentHeight;

        const finalHeight = Math.min(actualHeight, MAX_EXPAND_HEIGHT);

        setExpandedHeight(finalHeight);
        divRef.current.style.height = `${finalHeight}px`;
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(calculateHeight);
      });
    } else if (!isHovered && divRef.current) {
      divRef.current.style.height = "";
      setExpandedHeight(null);
    }
  }, [isHovered, isXl, dayEvents, buttonRef, divRef]);

  return expandedHeight;
};

