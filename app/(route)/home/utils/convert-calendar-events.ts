import { CalendarEvent as ApiCalendarEvent } from "@/app/feature/home/types";
import { CalendarEvent } from "@/components/shared/calendar/types";
import { getYear, getMonth, getDate, parse } from "date-fns";

export function convertCalendarEvents(
  apiEvents: Record<string, ApiCalendarEvent[]>
): Record<string, CalendarEvent[]> {
  const now = new Date();
  const currentYear = getYear(now);
  const currentMonth = getMonth(now);

  const convertedEvents: Record<string, CalendarEvent[]> = {};

  Object.keys(apiEvents).forEach((dateKey) => {
    const originalDate = parse(dateKey, "yyyy-MM-dd", new Date());
    const day = getDate(originalDate);

    const newDateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    convertedEvents[newDateKey] = apiEvents[dateKey].map((event) => ({
      id: String(event.id),
      clubName: event.clubName,
      artists: event.artists,
      performName: event.performName,
      image: event.image,
    }));
  });

  return convertedEvents;
}
