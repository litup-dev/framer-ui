import { format, subMonths, addMonths } from "date-fns";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/providers/get-query-client";
import { serverApiClient } from "@/lib/api-client";
import { getDateRange } from "@/app/feature/home/utils/get-date-range";
import { getQueryParams } from "@/app/feature/home/utils/get-query-params";
import type {
  CalendarEventsResponse,
  PerformancesResponse,
} from "@/app/feature/home/types";

import HomeContent from "./home-content";

async function prefetchCalendarMonth(
  queryClient: ReturnType<typeof getQueryClient>,
  monthKey: string
) {
  await queryClient.prefetchQuery({
    queryKey: ["calendarEvents", monthKey],
    queryFn: async () => {
      const response = await serverApiClient.get<CalendarEventsResponse>(
        `/api/v1/performances/calendar?month=${monthKey}`
      );
      return response.data;
    },
  });
}

export default async function HomePage() {
  const queryClient = getQueryClient();
  const now = new Date();
  const currentMonthKey = format(now, "yyyy-MM");
  const prevMonthKey = format(subMonths(now, 1), "yyyy-MM");
  const nextMonthKey = format(addMonths(now, 1), "yyyy-MM");

  await Promise.all([
    prefetchCalendarMonth(queryClient, currentMonthKey),
    prefetchCalendarMonth(queryClient, prevMonthKey),
    prefetchCalendarMonth(queryClient, nextMonthKey),
  ]);

  const { startDate, endDate } = getDateRange("week");
  const { isFree, area } = getQueryParams("week", "");

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      "performances",
      startDate,
      endDate,
      area ?? null,
      isFree ?? null,
    ],
    queryFn: async () => {
      const params: string[] = [
        `startDate=${startDate}`,
        `endDate=${endDate}`,
        `offset=0`,
        `limit=16`,
      ];
      if (isFree !== undefined) params.push(`isFree=${isFree}`);
      if (area) params.push(`area=${area}`);
      const response = await serverApiClient.get<PerformancesResponse>(
        `/api/v1/performances?${params.join("&")}`
      );
      const items = response.data.items;
      const total = response.data.total;
      const hasMore = items.length < total;
      return { data: items, offset: 0, hasMore, total };
    },
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  );
}
