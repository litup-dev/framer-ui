import {
  mutationOptions,
  queryOptions,
  QueryClient,
} from "@tanstack/react-query";
import {
  ClubDetail,
  ReviewResponse,
  ReviewListResponse,
  ReviewPaginatedResponse,
  ReviewsResponse,
  ClubDetailCalendarResponse,
  Performance,
  Club,
  CreateReviewResponse,
} from "@/app/feature/club/types";
import { apiClient } from "@/lib/api-client";
import {
  ReviewCategory,
  ReviewCategoryResponse,
} from "@/app/feature/club/types";

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
  const limit = params.limit || 5;
  const page = params.page || 1;
  const offset = params.offset ?? (page - 1) * limit;

  console.log(page, offset);
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
  queryOptions<ReviewCategoryResponse>({
    queryKey: ["review-category"],
    staleTime: Infinity,
    gcTime: Infinity,

    queryFn: async () => {
      const response = await apiClient.get<ReviewCategoryResponse>(
        "/api/v1/common/review-category"
      );
      // API 응답이 { data: ReviewCategory[] } 형태로 래핑되어 있는지 확인
      if ("data" in response && Array.isArray(response.data)) {
        return response;
      }
      // 직접 배열인 경우 래핑
      if (Array.isArray(response)) {
        return { data: response };
      }
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

const getReviewByIdOptions = (
  id: string,
  offset: number = 0,
  limit: number = 5
) =>
  queryOptions<ReviewPaginatedResponse>({
    queryKey: ["reviews", id, offset, limit],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await apiClient.get<
        { data: ReviewPaginatedResponse } | ReviewPaginatedResponse
      >(`/api/v1/clubs/${id}/reviews?offset=${offset}&limit=${limit}`);
      // API 응답이 { data: { items, total, offset, limit } } 형태로 래핑되어 있는지 확인
      if (
        "data" in response &&
        response.data &&
        typeof response.data === "object" &&
        "items" in response.data
      ) {
        return response.data;
      }
      // 직접 { items, total, offset, limit } 형태인 경우
      if ("items" in response) {
        return response as ReviewPaginatedResponse;
      }
      // 래핑된 경우
      return (response as { data: ReviewPaginatedResponse }).data;
    },
  });

const clubFavoriteByIdOptions = (id: number, queryClient?: QueryClient) =>
  mutationOptions({
    mutationKey: ["club-favorite", id],
    mutationFn: async () => {
      const response = await apiClient.post(`/api/v1/clubs/${id}/favorite`, {
        entityId: id,
      });

      return response;
    },
    onMutate: async () => {
      if (!queryClient) return;

      await queryClient.cancelQueries({ queryKey: ["clubs"] });

      const previousClubs = queryClient.getQueriesData({ queryKey: ["clubs"] });

      queryClient.setQueriesData<{ data: { items: Club[]; total: number } }>(
        { queryKey: ["clubs"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((club) =>
                club.id === id
                  ? { ...club, isFavorite: !club.isFavorite }
                  : club
              ),
            },
          };
        }
      );

      return { previousClubs };
    },
    onError: (err, variables, context) => {
      if (!queryClient || !context) return;

      context.previousClubs.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      if (!queryClient) return;

      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });

const getClubDetailCalendarByIdOptions = (id: number, month: string) =>
  queryOptions<Record<string, Performance[]>>({
    queryKey: ["club-detail-calendar", id, month],
    queryFn: async (): Promise<Record<string, Performance[]>> => {
      const response = await apiClient.get<ClubDetailCalendarResponse>(
        `/api/v1/performances/club/${id}/calendar?month=${month}`
      );
      return response.data;
    },
  });

const performaceAttendByIdOptions = (
  clubId: number,
  month: string,
  queryClient?: QueryClient
) =>
  mutationOptions<
    unknown,
    Error,
    number,
    { previousCalendar: Record<string, Performance[]> | undefined }
  >({
    mutationKey: ["performance-attend"],
    mutationFn: async (id: number) => {
      const response = await apiClient.post(
        `/api/v1/performances/${id}/attend`,
        {
          entityId: id,
        }
      );
      return response;
    },
    onMutate: async (id: number) => {
      if (!queryClient) return { previousCalendar: undefined };

      await queryClient.cancelQueries({
        queryKey: ["club-detail-calendar", clubId, month],
      });

      const previousCalendar = queryClient.getQueryData<
        Record<string, Performance[]>
      >(["club-detail-calendar", clubId, month]);

      queryClient.setQueryData<Record<string, Performance[]>>(
        ["club-detail-calendar", clubId, month],
        (old) => {
          if (!old) return old;

          const updated: Record<string, Performance[]> = {};
          Object.entries(old).forEach(([dateKey, performances]) => {
            updated[dateKey] = performances.map((performance) =>
              performance.id === id
                ? { ...performance, isAttend: !performance.isAttend }
                : performance
            );
          });

          return updated;
        }
      );

      return { previousCalendar };
    },
    onError: (err, id, context) => {
      if (!queryClient || !context) return;

      if (context?.previousCalendar) {
        queryClient.setQueryData(
          ["club-detail-calendar", clubId, month],
          context.previousCalendar
        );
      }
    },
    onSettled: () => {
      if (!queryClient) return;

      queryClient.invalidateQueries({
        queryKey: ["club-detail-calendar", clubId, month],
      });
    },
  });

const createReviewOptions = (entityId: number) =>
  mutationOptions<
    CreateReviewResponse,
    Error,
    { content: string; categories: number[]; rating: number }
  >({
    mutationKey: ["create-review"],
    mutationFn: async (params: {
      content: string;
      categories: number[];
      rating: number;
    }): Promise<CreateReviewResponse> => {
      const response = await apiClient.post<CreateReviewResponse>(
        `/api/v1/clubs/${entityId}/reviews`,
        params
      );
      return response;
    },
  });

const uploadClubReviewImageOptions = (reviewId: number) =>
  mutationOptions({
    mutationKey: ["upload-club-review-image", reviewId],
    mutationFn: async (params: FormData) => {
      const response = await apiClient.post(
        `/api/v1/reviews/${reviewId}/images`,
        params
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
  clubFavoriteByIdOptions,
  getClubDetailCalendarByIdOptions,
  performaceAttendByIdOptions,
  createReviewOptions,
  uploadClubReviewImageOptions,
};
