"use client";

import { useState } from "react";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserStats from "@/app/feature/user/components/user-stats";
import ViewingHistory from "@/app/feature/user/components/viewing-history";
import FavoriteClubs from "@/app/feature/user/components/favorite-clubs";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";
import { useUserStore } from "@/store/user-store";
import {
  UserStats as UserStatsType,
  UserPermissions,
} from "@/app/feature/user/types";

interface UserPageContentProps {
  isOwner: boolean;
  permissions: UserPermissions;
  userStats?: UserStatsType;
}

export default function UserPageContent({
  isOwner,
  permissions,
  userStats,
}: UserPageContentProps) {
  const { user } = useUserStore();
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isHistoryEditing, setIsHistoryEditing] = useState(false);

  const userId = user?.publicId ?? 0;
  const userIdNumber = Number(userId); // API 호출을 위해 number로 변환
  const pageTitle = isOwner
    ? "마이페이지"
    : `${user?.nickname || "사용자"}님의 활동`;

  // 공통 콘텐츠
  const renderContent = () => (
    <>
      {permissions.canViewStats && <UserStats data={userStats} />}
      {permissions.canViewPerformHistory && (
        <ViewingHistory
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          isEditing={isHistoryEditing}
          setIsEditing={setIsHistoryEditing}
          userId={userIdNumber}
          isOwner={isOwner}
        />
      )}
      {permissions.canViewFavoriteClubs && (
        <FavoriteClubs
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          userId={userIdNumber}
          isOwner={isOwner}
        />
      )}
    </>
  );

  // 프로필 영역 (xl+ 좌측, xl 이하 상단)
  const renderProfileSection = () => (
    <>
      <UserProfile
        user={user}
        isOwner={isOwner}
        isEditing={isProfileEditing}
        setIsEditing={setIsProfileEditing}
      />
      {isOwner && <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />}
    </>
  );

  return (
    <PageWrapper className="pt-6 2xl:pt-[124px]">
      {/* 1280px 이상: 2열 레이아웃 (프로필 좌측) */}
      <div className="hidden xl:flex xl:flex-row gap-6 xl:gap-10 2xl:gap-[85px]">
        <div className="w-full xl:w-[330px] 2xl:w-[365px] flex flex-col">
          <div className="mb-6">
            <Title className="xl:text-[32px] 2xl:text-[40px] invisible">
              {pageTitle}
            </Title>
          </div>
          {renderProfileSection()}
        </div>

        <div className="w-full xl:w-3/4 2xl:w-[1315px] flex flex-col gap-6">
          <Title className="xl:text-[32px] 2xl:text-[40px]">{pageTitle}</Title>
          {renderContent()}
        </div>
      </div>

      {/* 1279px 이하: 1열 레이아웃 (프로필 상단) */}
      <div className="flex xl:hidden flex-col gap-6">
        <Title className="text-[20px] md:text-[24px] lg:text-[32px]">
          {pageTitle}
        </Title>
        <UserProfile
          user={user}
          isOwner={isOwner}
          isEditing={isProfileEditing}
          setIsEditing={setIsProfileEditing}
        />
        {renderContent()}
        {isOwner && <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />}
      </div>
    </PageWrapper>
  );
}
