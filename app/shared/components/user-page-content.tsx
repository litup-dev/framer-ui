"use client";

import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserStats from "@/app/feature/user/components/user-stats";
import ViewingHistory from "@/app/feature/user/components/viewing-history";
import FavoriteClubs from "@/app/feature/user/components/favorite-clubs";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";
import {
  UserStats as UserStatsType,
  UserPermissions,
} from "@/app/feature/user/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/app/shared/components/footer";

interface UserPageContentProps {
  isOwner: boolean;
  permissions: UserPermissions;
  userStats?: UserStatsType;
  viewingUserId: string;
  viewingUserInfo?: {
    publicId: string;
    nickname: string;
    bio: string;
    profilePath: string | null;
    socialCode: string;
    socialName: string;
  };
}

export default function UserPageContent({
  isOwner,
  permissions,
  userStats,
  viewingUserId,
  viewingUserInfo,
}: UserPageContentProps) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isHistoryEditing, setIsHistoryEditing] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // 항상 viewingUserInfo 사용 (API에서 가져온 최신 데이터)
  const displayUser = viewingUserInfo ?? null;

  const publicId = viewingUserId;
  const pageTitle = isOwner
    ? "마이페이지"
    : `${displayUser?.nickname || "사용자"}님의 활동`;

  // 공통 콘텐츠
  const renderContent = () => (
    <>
      {permissions.canViewStats && <UserStats data={userStats} />}
      {/* Stats to Viewing History: lg: 80px, md: 64px, sm: 48px */}
      {permissions.canViewPerformHistory && (
        <ViewingHistory
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          isEditing={isHistoryEditing}
          setIsEditing={setIsHistoryEditing}
          publicId={publicId}
          isOwner={isOwner}
        />
      )}
      {/* Viewing History to Favorite Clubs: lg: 80px, md: 64px, sm: 48px */}
      {permissions.canViewFavoriteClubs && (
        <FavoriteClubs
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          publicId={publicId}
          isOwner={isOwner}
        />
      )}
    </>
  );

  // 프로필 영역 (xl+ 좌측, xl 이하 상단)
  const renderProfileSection = () => (
    <>
      <UserProfile
        key={displayUser?.publicId}
        user={displayUser}
        isOwner={isOwner}
        isEditing={isProfileEditing}
        setIsEditing={setIsProfileEditing}
        isBioExpanded={isBioExpanded}
        setIsBioExpanded={setIsBioExpanded}
      />
      {isOwner && <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />}
    </>
  );

  return (
    <>
      <PageWrapper className="pt-4 md:pt-[120px] lg:pt-[120px] 2xl:pt-[124px]">
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
            <Title className="xl:text-[32px] 2xl:text-[40px]">
              {pageTitle}
            </Title>
            {renderContent()}
          </div>
        </div>

        {/* 1279px 이하: 1열 레이아웃 (프로필 상단) */}
        <div className="flex xl:hidden flex-col">
          {/* lg, md, sm: 타이틀 + ellipsis_vertical */}
          {!isOwner ? (
            <div className="flex items-center justify-between">
              <Title className="text-[20px] md:text-[24px] lg:text-[32px]">
                {pageTitle}
              </Title>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center hover:opacity-70 transition-opacity">
                    <Image
                      src="/images/user/ellipsis-vertical.svg"
                      alt="메뉴"
                      width={28}
                      height={28}
                      className="w-7 h-7"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>신고하기</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Title className="text-[20px] md:text-[24px] lg:text-[32px]">
              {pageTitle}
            </Title>
          )}
          {/* Title to Profile: lg: 48px, md: 41px, sm: 38px */}
          <div className="md:mt-[41px] lg:mt-12">
            <UserProfile
              key={displayUser?.publicId}
              user={displayUser}
              isOwner={isOwner}
              isEditing={isProfileEditing}
              setIsEditing={setIsProfileEditing}
              isBioExpanded={isBioExpanded}
              setIsBioExpanded={setIsBioExpanded}
            />
          </div>
          {/* Profile to Stats: lg: 64px(normal)/50px(editing), md: 40px/30px, sm: 32px/17px */}
          <div
            className={
              isProfileEditing
                ? "mt-[17px] md:mt-[30px] lg:mt-[50px]"
                : "mt-8 md:mt-10 lg:mt-16"
            }
          >
            {renderContent()}
          </div>
          {isOwner && <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />}
        </div>
      </PageWrapper>
      <Footer className="mt-12 md:mt-16 lg:mt-20 xl:mt-40 2xl:mt-40" />
    </>
  );
}
