"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserPageContent from "@/app/shared/components/user-page-content";
import { getUserStatsOptions } from "@/app/feature/user/query-options";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 유저 통계 조회
  const { data: userStats } = useQuery({
    ...getUserStatsOptions(session?.userId ?? 0),
    enabled: !!session?.userId,
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.userId) {
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
      userInfo={session}
      isOwner={true}
      permissions={permissions}
      userStats={userStats}
    />
  );
}
