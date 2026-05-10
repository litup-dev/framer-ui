import { CalendarPerformance } from "@/app/feature/home/types";
import { CalendarEvent } from "@/components/shared/calendar/types";

export function convertCalendarEvents(
  apiEvents: Record<string, Array<{ performances: CalendarPerformance[] }>>
): Record<string, CalendarEvent[]> {
  const firstDate = Object.keys(apiEvents)[0];
  const firstPerformance =
    firstDate && apiEvents[firstDate]?.[0]?.performances?.[0];
  console.log("[calendar API] first performance keys:", firstPerformance && Object.keys(firstPerformance));
  console.log("[calendar API] first performance:", firstPerformance);

  const convertedEvents: Record<string, CalendarEvent[]> = {};

  Object.keys(apiEvents).forEach((dateKey) => {
    const performances = apiEvents[dateKey].flatMap((item) => item.performances);
    convertedEvents[dateKey] = performances.map((p) => ({
      id: p.club.id,
      clubName: p.club.name,
      performances: [
        {
          id: p.id,
          performDate: p.performDate,
          artists: p.artists,
          images: p.images,
        },
      ],
    }));
  });

  return convertedEvents;
}
