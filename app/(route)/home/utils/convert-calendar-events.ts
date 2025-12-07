import { CalendarEvent as ApiCalendarEvent } from "@/app/feature/home/types";
import { CalendarEvent } from "@/components/shared/calendar/types";

export function convertCalendarEvents(
  apiEvents: Record<string, ApiCalendarEvent[]>
): Record<string, CalendarEvent[]> {
  const convertedEvents: Record<string, CalendarEvent[]> = {};

  Object.keys(apiEvents).forEach((dateKey) => {
    // API에서 받은 날짜 키를 그대로 사용 (yyyy-MM-dd 형식)
    convertedEvents[dateKey] = apiEvents[dateKey].map((event) => ({
      id: String(event.id),
      clubName: event.clubName,
      artists: event.artists,
      performName: event.performName,
      image: event.image,
    }));
  });

  return convertedEvents;
}
