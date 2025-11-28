import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import {
  CalendarEventsResponse,
  PerformancesResponse,
} from "@/app/feature/home/types";
import { format } from "date-fns";
import { apiClient } from "@/lib/api-client";

const getCalendarEventsOptions = (month: string) =>
  queryOptions({
    queryKey: ["calendarEvents", month],
    queryFn: async () => {
      const response = await apiClient.get<CalendarEventsResponse>(
        `/api/v1/performances/calendar?month=${month}`
      );
      return response.data;
    },
  });

const getCalendarEventsListOptions = () => {
  const currentMonth = format(new Date(), "yyyy-MM");

  return infiniteQueryOptions({
    queryKey: ["calendarEventsList"],
    queryFn: async ({ pageParam }) => {
      const month = pageParam as string;
      const response = await apiClient.get<CalendarEventsResponse>(
        `/api/v1/performances/calendar?month=${month}`
      );
      return { month, data: response.data };
    },
    initialPageParam: currentMonth,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const [year, month] = lastPageParam.split("-").map(Number);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
    },
  });
};

const getPerformancesOptions = (
  startDate: string,
  endDate: string,
  area?: string,
  isFree?: boolean
) => {
  return infiniteQueryOptions({
    queryKey: ["performances", startDate, endDate, area, isFree],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const params: string[] = [`startDate=${startDate}`, `endDate=${endDate}`];

      if (isFree !== undefined) {
        params.push(`isFree=${isFree}`);
      }

      params.push(`offset=${offset}`, `limit=16`);

      if (area) {
        params.push(`area=${area}`);
      }

      const endpoint = `/api/v1/performances?${params.join("&")}`;
      const response = await apiClient.get<PerformancesResponse>(endpoint);
      const items = response.data.items;
      const total = response.data.total;
      const hasMore = offset + items.length < total;
      return {
        data: items,
        offset,
        hasMore,
        total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore === false) {
        return undefined;
      }
      return lastPage.offset + 16;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export {
  getCalendarEventsOptions,
  getCalendarEventsListOptions,
  getPerformancesOptions,
};
