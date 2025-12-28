"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserStats from "@/app/feature/user/components/user-stats";
import ViewingHistory from "@/app/feature/user/components/viewing-history";
import FavoriteClubs from "@/app/feature/user/components/favorite-clubs";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";

interface UserPageProps {
  searchParams: Promise<{ userId?: string }>;
}

export default function UserPage({ searchParams }: UserPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isHistoryEditing, setIsHistoryEditing] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string | null>(null);

  // searchParams 처리
  useEffect(() => {
    searchParams.then((params) => {
      setTargetUserId(params.userId || null);
    });
  }, [searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  // 현재 로그인한 유저의 페이지인지 확인
  const isOwner = !targetUserId || targetUserId === String(session.userId);

  // TODO: targetUserId가 있으면 해당 유저 정보를 API에서 가져오기
  // 일단은 mock data 사용
  const targetUser = isOwner
    ? session
    : {
        ...session,
        userId: targetUserId || "",
      };

  // 페이지 헤더 타이틀
  const pageTitle = isOwner
    ? "마이페이지"
    : `${targetUser.user?.name}님의 활동`;

  return (
    <PageWrapper className="pt-6 sm:pt-[104px] 2xl:pt-[124px]">
      {/* 1280px 이상: 2열 레이아웃 */}
      <div className="hidden xl:flex xl:flex-row gap-6 xl:gap-10 2xl:gap-[85px]">
        {/* 좌측: 프로필 섹션 + 메뉴 - 너비: xl 330px, 2xl 365px */}
        <div className="w-full xl:w-[330px] 2xl:w-[365px] flex flex-col">
          {/* 타이틀 높이만큼 공백 추가 */}
          <div className="mb-6">
            <div className="font-bold text-[24px] xl:text-[28px] invisible">
              {pageTitle}
            </div>
          </div>

          <UserProfile
            session={targetUser}
            isOwner={isOwner}
            isEditing={isProfileEditing}
            setIsEditing={setIsProfileEditing}
          />

          {/* 사이드바 메뉴는 마이페이지일 때만 표시 - 간격: xl 80px, 2xl 100px */}
          {isOwner && <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />}
        </div>

        {/* 우측: 페이지 헤더 + 통계, 관람 기록, 관심 클럽 */}
        <div className="w-full xl:w-3/4 2xl:w-[1315px] flex flex-col gap-6">
          <Title className="text-black">{pageTitle}</Title>
          <UserStats />
          <ViewingHistory
            className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
            isEditing={isHistoryEditing}
            setIsEditing={setIsHistoryEditing}
          />
          <FavoriteClubs className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]" />
        </div>
      </div>

      {/* 1024~1279px: 1열 레이아웃 */}
      <div className="hidden lg:flex xl:hidden flex-col gap-6">
        <Title className="text-black">{pageTitle}</Title>
        <UserProfile
          session={targetUser}
          isOwner={isOwner}
          isEditing={isProfileEditing}
          setIsEditing={setIsProfileEditing}
        />
        <UserStats />
        <ViewingHistory
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          isEditing={isHistoryEditing}
          setIsEditing={setIsHistoryEditing}
        />
        <FavoriteClubs className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]" />
        {/* 사이드바 메뉴는 가장 하단 - FavoriteClubs와 간격: lg 80px, md 64px, sm 48px */}
        {isOwner && <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />}
      </div>

      {/* 1023px 이하: 모바일 레이아웃 */}
      <div className="flex lg:hidden flex-col gap-6">
        <Title className="text-black">{pageTitle}</Title>
        <UserProfile
          session={targetUser}
          isOwner={isOwner}
          isEditing={isProfileEditing}
          setIsEditing={setIsProfileEditing}
        />
        <UserStats />
        <ViewingHistory
          className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]"
          isEditing={isHistoryEditing}
          setIsEditing={setIsHistoryEditing}
        />
        <FavoriteClubs className="mt-12 md:mt-16 lg:mt-20 xl:mt-20 2xl:mt-[100px]" />
        {/* 사이드바 메뉴는 가장 하단 - FavoriteClubs와 간격: lg 80px, md 64px, sm 48px */}
        {isOwner && <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />}
      </div>
    </PageWrapper>
  );
}
