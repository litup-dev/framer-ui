"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserStatsOptions, getUserInfo } from "@/app/feature/user/query-options";

/**
 * 유저 페이지 공통 데이터 조회 Hook
 * - 유저 정보 (bio, 프로필, 닉네임 등)
 * - 유저 통계
 */
export function useUserPageData(publicId: string | null) {
  const userInfo = useQuery({
    queryKey: ["userInfo", publicId],
    queryFn: () => getUserInfo(publicId!),
    enabled: !!publicId,
  });

  const userStats = useQuery({
    ...getUserStatsOptions(publicId || ""),
    enabled: !!publicId,
  });

  return {
    userInfo: userInfo.data?.data,
    userStats: userStats.data,
    isLoading: userInfo.isLoading || userStats.isLoading,
    error: userInfo.error || userStats.error,
  };
}
