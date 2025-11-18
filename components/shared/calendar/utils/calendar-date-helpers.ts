import { format, isSameMonth, isSameDay, isToday, getDate } from "date-fns";
import { CalendarEvent } from "../types";

export const getEventsForDate = (
  date: Date,
  events: Record<string, CalendarEvent[]>
): CalendarEvent[] => {
  const dateKey = format(date, "yyyy-MM-dd");
  return events[dateKey] || [];
};

export const getDayState = (
  day: Date,
  currentMonth: Date,
  hoveredDate: Date | null,
  selectedDate?: Date
) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isHovered = hoveredDate ? isSameDay(day, hoveredDate) : false;
  const isTodayDate = isToday(day);
  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
  const dayNumber = getDate(day);

  return {
    isCurrentMonth,
    isHovered,
    isTodayDate,
    isSelected,
    dayNumber,
  };
};

export const calculateRowState = (
  rowIndex: number,
  selectedRowIndex: number | null,
  isXl: boolean
) => {
  const isRowExpanded =
    !isXl && (selectedRowIndex === null || selectedRowIndex === rowIndex);
  const isCollapsedAndNotSelected =
    !isXl && selectedRowIndex !== null && selectedRowIndex !== rowIndex;

  return {
    isRowExpanded,
    isCollapsedAndNotSelected,
  };
};

