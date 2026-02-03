import { PropsWithChildren } from "react";
import { getQueryClient } from "@/providers/get-query-client";
import { serverApiClient } from "@/lib/api-client";

export default async function HomeLayout({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["calendarEventsList"],
    initialPageParam: (new Date(), "yyyy-MM"),
    queryFn: async ({ pageParam }) => {
      const month = pageParam as string;
      const res = await serverApiClient.get(
        `/api/v1/performances/calendar?month=${month}`
      );
      return res;
    },
    getNextPageParam: (_lastPage: unknown, _allPages: unknown, lastPageParam: string) => {
      const [year, month] = lastPageParam.split("-").map(Number);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      return `${nextYear}-${String(nextMonth).padStart(2, "0")}`;
    },
  });
  return <>{children}</>;
}
