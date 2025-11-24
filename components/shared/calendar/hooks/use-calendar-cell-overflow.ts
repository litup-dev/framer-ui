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
    const element = eventsContainerRef.current;
    if (!element) {
      setIsOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      if (element) {
        // hover 상태일 때는 max-height 560px를 기준으로 체크
        if (isHovered) {
          const maxHeight = 560; // 560px
          const overflowing = element.scrollHeight > maxHeight;
          setIsOverflowing(overflowing);
        } else {
          // hover가 아닐 때는 실제 clientHeight와 비교
          const overflowing = element.scrollHeight > element.clientHeight;
          setIsOverflowing(overflowing);
        }
      }
    };

    // 초기 체크
    checkOverflow();

    // hover 상태일 때는 애니메이션 완료 후 체크 (0.5초 + 여유시간)
    const delay = isHovered ? 600 : 100;
    const timeoutId = setTimeout(checkOverflow, delay);

    // ResizeObserver로 요소 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    resizeObserver.observe(element);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [dayEvents, isHovered, dayNumber, eventsContainerRef]);

  return isOverflowing;
};

