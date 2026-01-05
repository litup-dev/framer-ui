import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { PerformanceInfoResponse, PerformanceCommentResponse } from "@/app/feature/performance/detail/types";

// 공연 상세 정보 API
export const getPerformanceDetailOptions = (performanceId: number) =>
  queryOptions({
    queryKey: ["performanceDetail", performanceId],
    queryFn: async () => {
      const response = await apiClient.get<PerformanceInfoResponse>(
        `/api/v1/performance/${performanceId}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });


// 공연 댓글 목록 API (Infinite Query)
export const getPerformanceCommentsOptions = (
  performanceId: number,
  limit: number = 10
) =>
  infiniteQueryOptions({
    queryKey: ["performanceComments", performanceId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const offset = pageParam; // pageParam을 offset으로 사용
      const response = await apiClient.get<PerformanceCommentResponse>(
        `/api/v1/performance/${performanceId}/reviews?offset=${offset}&limit=${limit}`
      );
      const items = response.data.items;
      const total = response.data.total;
      const hasMore = offset + items.length < total;
      return {
        items,
        offset,
        hasMore,
        total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: { hasMore: boolean; offset: number }) => {
      if (lastPage.hasMore === false) {
        return undefined;
      }
      return lastPage.offset + limit;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });