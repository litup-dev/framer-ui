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
} from "@/app/feature/user/types";

// 유저 통계 API
export const getUserStatsOptions = (userId: number) =>
  queryOptions({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      const response = await apiClient.get<UserStatsResponse>(
        `/api/v1/users/stats/${userId}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

// 유저 관람 기록 API (Infinite Query)
export const getPerformHistoryOptions = (userId: number, limit: number = 4) =>
  infiniteQueryOptions({
    queryKey: ["performHistory", userId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const offset = pageParam;
      const response = await apiClient.get<PerformHistoryResponse>(
        `/api/v1/users/perform-history/${userId}?offset=${offset}&limit=${limit}`
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
export const getFavoriteClubsOptions = (userId: number, limit: number = 4) =>
  infiniteQueryOptions({
    queryKey: ["favoriteClubs", userId],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const offset = pageParam;
      const response = await apiClient.get<FavoriteClubsResponse>(
        `/api/v1/users/favorite-clubs/${userId}?offset=${offset}&limit=${limit}`
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
  entityIds: number[]
): Promise<DeleteFavoriteClubsResponse> => {
  const response = await apiClient.delete<DeleteFavoriteClubsResponse>(
    "/api/v1/users/favorite-clubs",
    { entityIds } as DeleteFavoriteClubsRequest
  );
  return response;
};

// 관람 기록 삭제 Mutation
export const deletePerformHistory = async (
  entityIds: number[]
): Promise<DeletePerformHistoryResponse> => {
  const response = await apiClient.delete<DeletePerformHistoryResponse>(
    "/api/v1/users/perform-history",
    { entityIds } as DeletePerformHistoryRequest
  );
  return response;
};

// 유저 정보 조회 API
export const getUserInfo = async (userId: number): Promise<UserInfoResponse> => {
  const response = await apiClient.get<UserInfoResponse>(
    `/api/v1/users/${userId}`
  );
  return response;
};

// 유저 프로필 수정 Mutation
export const updateUserInfo = async (
  data: UpdateUserInfoRequest
): Promise<UpdateUserInfoResponse> => {
  const response = await apiClient.patch<UpdateUserInfoResponse>(
    "/api/v1/users/info",
    data
  );
  return response;
};
