import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  NoticeListData,
  NoticeListResponse,
  NoticeSort,
  PopupNotice,
  PopupNoticesResponse,
} from "@/app/feature/notice/types";

interface GetNoticesParams {
  keyword?: string;
  sort: NoticeSort;
  offset: number;
  limit: number;
}

const buildQueryString = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const pairs: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    pairs.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  });
  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
};

export const getNoticesOptions = (params: GetNoticesParams) => {
  const normalized: GetNoticesParams = {
    sort: params.sort,
    offset: params.offset,
    limit: params.limit,
    ...(params.keyword && { keyword: params.keyword }),
  };
  return queryOptions<NoticeListData>({
    queryKey: [
      "notices",
      normalized.keyword,
      normalized.sort,
      normalized.offset,
      normalized.limit,
    ],
    queryFn: async () => {
      const response = await apiClient.get<NoticeListResponse>(
        `/api/v1/notices${buildQueryString(normalized as unknown as Record<string, string | number>)}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const getPopupNoticesOptions = () =>
  queryOptions<PopupNotice[]>({
    queryKey: ["notices", "popup"],
    queryFn: async () => {
      const response = await apiClient.get<PopupNoticesResponse>(
        `/api/v1/notices/popup`,
      );
      return response.data.items;
    },
    staleTime: 60_000,
  });
