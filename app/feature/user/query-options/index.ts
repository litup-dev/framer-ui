import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  UserStatsResponse,
  PerformHistoryResponse,
  FavoriteClubsResponse,
  DeleteFavoriteClubsRequest,
  DeleteFavoriteClubsResponse,
  DeletePerformHistoryRequest,
  DeletePerformHistoryResponse,
  UserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  PrivacySettingsResponse,
  UpdatePrivacySettingsRequest,
  UpdatePrivacySettingsResponse,
  UserClubReviewsResponse,
} from "@/app/feature/user/types";
import { PerformanceCommentResponse } from "@/app/feature/performance/detail/types";

// 유저 통계 API
export const getUserStatsOptions = (publicId: string) =>
  queryOptions({
    queryKey: ["userStats", publicId],
    queryFn: async () => {
      const response = await apiClient.get<UserStatsResponse>(
        `/api/v1/users/stats/${publicId}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

// 유저 관람 기록 API (Infinite Query)
export const getPerformHistoryOptions = (publicId: string, limit: number = 4) =>
  infiniteQueryOptions({
    queryKey: ["performHistory", publicId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const offset = pageParam;
      const response = await apiClient.get<PerformHistoryResponse>(
        `/api/v1/users/perform-history/${publicId}?offset=${offset}&limit=${limit}`,
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// 유저 관심 클럽 API (Infinite Query)
export const getFavoriteClubsOptions = (publicId: string, limit: number = 4) =>
  infiniteQueryOptions({
    queryKey: ["favoriteClubs", publicId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const offset = pageParam;
      const response = await apiClient.get<FavoriteClubsResponse>(
        `/api/v1/users/favorite-clubs/${publicId}?offset=${offset}&limit=${limit}`,
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// 관심 클럽 삭제 Mutation
export const deleteFavoriteClubs = async (
  entityIds: number[],
): Promise<DeleteFavoriteClubsResponse> => {
  const response = await apiClient.delete<DeleteFavoriteClubsResponse>(
    "/api/v1/users/favorite-clubs",
    { entityIds } as DeleteFavoriteClubsRequest,
  );
  return response;
};

// 관람 기록 삭제 Mutation
export const deletePerformHistory = async (
  entityIds: number[],
): Promise<DeletePerformHistoryResponse> => {
  const response = await apiClient.delete<DeletePerformHistoryResponse>(
    "/api/v1/users/perform-history",
    { entityIds } as DeletePerformHistoryRequest,
  );
  return response;
};

// 유저 정보 조회 API
export const getUserInfo = async (
  publicId: string,
): Promise<UserInfoResponse> => {
  const response = await apiClient.get<UserInfoResponse>(
    `/api/v1/users/${publicId}`,
  );
  return response;
};

// 유저 프로필 수정 Mutation
export const updateUserInfo = async (
  data: UpdateUserInfoRequest,
): Promise<UpdateUserInfoResponse> => {
  const response = await apiClient.patch<UpdateUserInfoResponse>(
    "/api/v1/users/info",
    data,
  );
  return response;
};

// 유저 공개범위 설정 조회 API
export const getPrivacySettingsOptions = () =>
  queryOptions({
    queryKey: ["privacySettings"],
    queryFn: async () => {
      const response = await apiClient.get<PrivacySettingsResponse>(
        "/api/v1/users/settings/privacy",
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

// 유저 공개범위 설정 수정 Mutation
export const updatePrivacySettings = async (
  data: UpdatePrivacySettingsRequest,
): Promise<UpdatePrivacySettingsResponse> => {
  const response = await apiClient.patch<UpdatePrivacySettingsResponse>(
    "/api/v1/users/settings/privacy",
    data,
  );
  return response;
};

// 유저 클럽 리뷰 목록 조회 API
export const getUserClubReviewsOptions = (sort: string = "-createdAt") =>
  queryOptions({
    queryKey: ["userClubReviews", sort],
    queryFn: async () => {
      const encodedSort = encodeURIComponent(sort);
      const response = await apiClient.get<UserClubReviewsResponse>(
        `/api/v1/users/me/club-reviews?sort=${encodedSort}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// 유저가 작성한 공연 한줄평 목록 조회 API
export const getMyPerformanceCommentsOptions = (
  sort: string = "-createdAt",
  offset: number = 0,
  limit: number = 10,
) =>
  queryOptions({
    queryKey: ["myPerformanceComments", sort, offset, limit],
    queryFn: async () => {
      const encodedSort = encodeURIComponent(sort);
      const response = await apiClient.get<PerformanceCommentResponse>(
        `/api/v1/users/me/perform-review?sort=${encodedSort}&offset=${offset}&limit=${limit}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

// 유저가 좋아요한 공연 한줄평 목록 조회 API
export const getMyLikedPerformanceCommentsOptions = (
  sort: string = "-createdAt",
  offset: number = 0,
  limit: number = 10,
) =>
  queryOptions({
    queryKey: ["myLikedPerformanceComments", sort, offset, limit],
    queryFn: async () => {
      const encodedSort = encodeURIComponent(sort);
      const response = await apiClient.get<PerformanceCommentResponse>(
        `/api/v1/users/me/liked-review?sort=${encodedSort}&offset=${offset}&limit=${limit}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
