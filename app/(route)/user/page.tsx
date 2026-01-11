"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserPageContent from "@/app/shared/components/user-page-content";
import { getUserStatsOptions, getUserInfo } from "@/app/feature/user/query-options";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 유저 정보 조회
  const { data: userInfoResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ["userInfo", session?.userId],
    queryFn: () => getUserInfo(Number(session?.userId)),
    enabled: !!session?.userId,
  });

  // 유저 통계 조회
  const { data: userStats } = useQuery({
    ...getUserStatsOptions(session?.userId ? Number(session.userId) : 0),
    enabled: !!session?.userId,
  });

  if (status === "loading" || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!session || !session.userId) {
    return null;
  }

  if (!userInfoResponse?.data) {
    return <div>유저 정보를 불러올 수 없습니다.</div>;
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
    />
  );
}
