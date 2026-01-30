"use client";

import { useEffect, useState } from "react";
import UserPageContent from "@/app/shared/components/user-page-content";
import { useUserPageData } from "@/app/feature/user/hooks/use-user-page-data";

interface UserPageProps {
  params: Promise<{ publicId: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const [publicId, setPublicId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setPublicId(p.publicId);
    });
  }, [params]);

  const { userInfo, userStats, isLoading } = useUserPageData(publicId);

  if (isLoading || !publicId) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
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
      viewingUserId={publicId}
      viewingUserInfo={userInfo}
    />
  );
}
