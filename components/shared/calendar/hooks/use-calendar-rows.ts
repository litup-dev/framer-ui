"use client";

import { useMemo } from "react";
import { calculateRowState } from "../utils/calendar-date-helpers";

interface UseCalendarRowsProps {
  days: Date[];
  selectedRowIndex: number | null;
  isXl: boolean;
}

export const useCalendarRows = ({
  days,
  selectedRowIndex,
  isXl,
}: UseCalendarRowsProps) => {
  const rows = useMemo(() => {
    return Array.from({ length: Math.ceil(days.length / 7) }, (_, rowIndex) => {
      const { isRowExpanded, isCollapsedAndNotSelected } = calculateRowState(
        rowIndex,
        selectedRowIndex,
        isXl
      );
      return {
        days: days.slice(rowIndex * 7, rowIndex * 7 + 7),
        isRowExpanded,
        isCollapsedAndNotSelected,
      };
    });
  }, [days, selectedRowIndex, isXl]);

  const hasCollapsedRow = !isXl && selectedRowIndex !== null;

  return { rows, hasCollapsedRow };
};
