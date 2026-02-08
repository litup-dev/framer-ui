"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store";
import { getUserInfo } from "../query-options";

/**
 * Custom hook to require authentication for user pages
 * - Redirects to login if unauthenticated
 * - Fetches and caches user info if not available
 * - Updates store with latest user info including provider
 */
export function useRequireAuth() {
  const { user, isAuthenticated, setUser } = useUserStore();
  const router = useRouter();
  const hasUpdatedRef = useRef(false);

  // 유저 정보 조회 (store에 socialCode가 없거나 bio가 없을 때만)
  const shouldFetchUserInfo = !!(isAuthenticated && user?.publicId && (!user.socialCode || !user.bio));

  const { data: userInfoData, isLoading } = useQuery({
    queryKey: ["userInfo", user?.publicId],
    queryFn: () => getUserInfo(user!.publicId),
    enabled: shouldFetchUserInfo,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 유저 정보를 가져왔으면 store에 업데이트 (한 번만)
  useEffect(() => {
    if (userInfoData?.data && !hasUpdatedRef.current) {
      const currentUser = useUserStore.getState().user;
      if (currentUser?.publicId) {
        hasUpdatedRef.current = true;
        setUser({
          publicId: currentUser.publicId,
          token: currentUser.token,
          bio: userInfoData.data.bio,
          socialCode: userInfoData.data.socialCode,
          socialName: userInfoData.data.socialName,
          nickname: userInfoData.data.nickname,
          profilePath: userInfoData.data.profilePath,
        });
      }
    }
  }, [userInfoData?.data, setUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
}
