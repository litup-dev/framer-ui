import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  ClubDetail,
  ReviewResponse,
  ReviewListResponse,
  ReviewsResponse,
} from "@/app/feature/club/types";
import { apiClient } from "@/lib/api-client";
import { ReviewCategory } from "@/app/feature/club/types";

interface GetClubsParams {
  searchKey?: string;
  area?: string;
  latitude?: number | null;
  longitude?: number | null;
  keywords?: number[];
  sort?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

const buildQueryString = (params: GetClubsParams): string => {
  const pairs: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "keywords" && Array.isArray(value) && value.length > 0) {
      value.forEach((keywordId) => {
        pairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(keywordId))}`
        );
      });
    } else if (typeof value === "number" || typeof value === "string") {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(String(value));
      pairs.push(`${encodedKey}=${encodedValue}`);
    }
  });

  return pairs.length > 0 ? `?${pairs.join("&")}` : "";
};

const getClubsOptions = (params: GetClubsParams = {}) => {
  const limit = params.limit || 20;
  const page = params.page || 1;
  const offset = params.offset ?? (page - 1) * limit;

  const normalizedParams = {
    area: params.area || "other",
    sort: params.sort || "-reviewCount",
    offset,
    limit,
    ...(params.searchKey && { searchKey: params.searchKey }),
    ...(params.latitude !== undefined &&
      params.latitude !== null && { latitude: params.latitude }),
    ...(params.longitude !== undefined &&
      params.longitude !== null && { longitude: params.longitude }),
    ...(params.keywords &&
      params.keywords.length > 0 && { keywords: params.keywords }),
  };

  return queryOptions({
    queryKey: [
      "clubs",
      normalizedParams.searchKey,
      normalizedParams.area,
      normalizedParams.latitude,
      normalizedParams.longitude,
      normalizedParams.keywords,
      normalizedParams.sort,
      page,
      normalizedParams.limit,
    ],
    queryFn: async () => {
      return apiClient.get(
        `/api/v1/clubs${buildQueryString(normalizedParams)}`
      );
    },
  });
};

const getReviewCategoryOptions = () =>
  queryOptions<ReviewCategory[]>({
    queryKey: ["review-category"],
    staleTime: Infinity,
    gcTime: Infinity,

    queryFn: async () => {
      const response = await apiClient.get("/api/v1/common/review-category");
      return response;
    },
  });

const getClubByIdOptions = (id: string) =>
  queryOptions<ClubDetail>({
    queryKey: ["club", id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await apiClient.get<ClubDetail>(`/api/v1/clubs/${id}`);
      return response;
    },
  });

const mutateFavoriteClub = (id: string) =>
  mutationOptions({
    mutationKey: ["favorite-club", id],
    mutationFn: async () => {
      const response = await apiClient.post(`/api/v1/clubs/${id}/favorite`, {
        entityId: id,
      });

      return response;
    },
  });

const getReviewByIdOptions = (id: string) =>
  queryOptions<ReviewResponse>({
    queryKey: ["reviews", id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await apiClient.get<ReviewResponse>(
        `/api/v1/reviews/${id}`
      );
      return response;
    },
  });

export {
  getClubsOptions,
  getClubByIdOptions,
  mutateFavoriteClub,
  getReviewCategoryOptions,
  getReviewByIdOptions,
};
