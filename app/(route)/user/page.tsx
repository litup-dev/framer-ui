"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserPageContent from "@/app/shared/components/user-page-content";
import { getUserStatsOptions } from "@/app/feature/user/query-options";
import { useUserStore } from "@/store/user-store";

export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const userId = user?.id ? Number(user.id) : 0;

  // 유저 통계 조회
  const { data: userStats, isLoading: isStatsLoading } = useQuery({
    ...getUserStatsOptions(userId),
    enabled: !!userId,
  });

  if (isStatsLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // 마이페이지는 모든 권한 허용
  const permissions = {
    canViewStats: true,
    canViewPerformHistory: true,
    canViewFavoriteClubs: true,
  };

  return (
    <UserPageContent
      isOwner={true}
      permissions={permissions}
      userStats={userStats}
      viewingUserId={userId}
    />
  );
}
