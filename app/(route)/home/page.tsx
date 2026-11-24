import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/providers/get-query-client";
import { serverApiClient } from "@/lib/api-client";
import { getDateRange } from "@/app/feature/home/utils/get-date-range";
import { getQueryParams } from "@/app/feature/home/utils/get-query-params";
import type { PerformancesResponse } from "@/app/feature/home/types";

import HomeContent from "./home-content";

// ISR(revalidate)은 Vercel Hobby의 ISR Writes 한도를 소진시켜 force-dynamic으로 되돌린다.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const queryClient = getQueryClient();

  const { startDate, endDate } = getDateRange("week");
  const { isFree, area } = getQueryParams("week", "");

  // 캘린더는 화면 하단이라 서버에서 기다리지 않고 클라이언트(home-content)에서 조회한다.
  // 첫 화면에 필요한 기본 카테고리(week) 공연 목록만 프리패치한다.
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["performances", startDate, endDate, area ?? null, isFree ?? null],
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
        `/api/v1/performances?${params.join("&")}`,
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
