"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserPageContent from "@/app/shared/components/user-page-content";
import {
  getUserStatsOptions,
  getUserInfo,
} from "@/app/feature/user/query-options";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setUserId(p.userId);
    });
  }, [params]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 유저 정보 조회
  const { data: userInfoResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(Number(userId)),
    enabled: !!userId,
  });

  // 유저 통계 조회
  const { data: userStats } = useQuery({
    ...getUserStatsOptions(Number(userId)),
    enabled: !!userId,
  });

  if (status === "loading" || isUserLoading || !userId) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  if (!userInfoResponse?.data) {
    return <div>유저 정보를 불러올 수 없습니다.</div>;
  }

  // 임시: 모든 권한 허용 (나중에 권한 API 추가 예정)
  const permissions = {
    canViewStats: true,
    canViewPerformHistory: true,
    canViewFavoriteClubs: true,
  };

  return (
    <UserPageContent
      isOwner={false}
      permissions={permissions}
      userStats={userStats}
    />
  );
}
