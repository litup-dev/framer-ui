import { queryOptions } from "@tanstack/react-query";
import { AllPerformancesResponse } from "@/app/feature/all-performances/types";
import { apiClient } from "@/lib/api-client";

type TimeFilter = "upcoming" | "past";
type AreaFilter = "seoul" | "hongdae" | "busan" | "other";

interface GetAllPerformancesParams {
  keyword?: string;
  timeFilter?: TimeFilter;
  area?: AreaFilter;
  offset?: number;
  limit?: number;
}

const buildQueryString = (params: GetAllPerformancesParams): string => {
  const pairs: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (
      typeof value === "number" ||
      typeof value === "string" ||
      typeof value === "boolean"
    ) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(String(value));
      pairs.push(`${encodedKey}=${encodedValue}`);
    }
  });

  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
};

const getAllPerformancesOptions = (params: GetAllPerformancesParams = {}) => {
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;

  const normalizedParams: GetAllPerformancesParams = {
    ...(params.timeFilter && { timeFilter: params.timeFilter }),
    ...(params.area && { area: params.area }),
    ...(params.keyword && { keyword: params.keyword }),
    offset,
    limit,
  };

  return queryOptions<AllPerformancesResponse["data"]>({
    queryKey: [
      "all-performances",
      normalizedParams.keyword,
      normalizedParams.timeFilter,
      normalizedParams.area,
      offset,
      limit,
    ],
    queryFn: async () => {
      const response = await apiClient.get<AllPerformancesResponse>(
        `/api/v1/performances/search${buildQueryString(normalizedParams)}`
      );
      return response.data;
    },
  });
};

export { getAllPerformancesOptions };
