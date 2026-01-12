"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserPageContent from "@/app/shared/components/user-page-content";
import {
  getUserStatsOptions,
  getUserInfo,
} from "@/app/feature/user/query-options";
import { useUserStore } from "@/store/user-store";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { user } = useUserStore();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setUserId(p.userId);
    });
  }, [params]);

  const userIdNumber = userId ? Number(userId) : 0;
  const isCurrentUser = user?.id === userId;

  // 유저 정보 조회 - 현재 로그인한 유저라면 스킵 (user-store에 이미 있음)
  const { data: userInfoResponse, isLoading: isUserLoading } = useQuery({
    queryKey: ["userInfo", userIdNumber],
    queryFn: () => getUserInfo(userIdNumber),
    enabled: !!userIdNumber && !isCurrentUser,
  });

  // 유저 통계 조회
  const { data: userStats } = useQuery({
    ...getUserStatsOptions(userIdNumber),
    enabled: !!userIdNumber,
  });

  if (isUserLoading || !userId) {
    return <div>Loading...</div>;
  }

  if (!isCurrentUser && !userInfoResponse?.data) {
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
      viewingUserId={userIdNumber}
      viewingUserInfo={userInfoResponse?.data}
    />
  );
}
