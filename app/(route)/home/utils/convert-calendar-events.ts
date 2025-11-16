import { CalendarEvent } from "@/components/shared/custom-calendar";
import { getYear, getMonth, getDate, parse } from "date-fns";

export function convertCalendarEvents(
  mockEvents: Record<string, CalendarEvent[]>
): Record<string, CalendarEvent[]> {
  const now = new Date();
  const currentYear = getYear(now);
  const currentMonth = getMonth(now);

  const convertedEvents: Record<string, CalendarEvent[]> = {};

  Object.keys(mockEvents).forEach((dateKey) => {
    const originalDate = parse(dateKey, "yyyy-MM-dd", new Date());
    const day = getDate(originalDate);
    const newDate = new Date(currentYear, currentMonth, day);
    const newDateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    convertedEvents[newDateKey] = mockEvents[dateKey];
  });

  return convertedEvents;
}

