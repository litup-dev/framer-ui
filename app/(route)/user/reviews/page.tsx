"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";

export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProfileEditing, setIsProfileEditing] = useState(false);

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

  return (
    <PageWrapper className="pt-6 sm:pt-[104px] 2xl:pt-[124px]">
      {/* 1280px 이상: 2열 레이아웃 */}
      <div className="hidden xl:flex xl:flex-row gap-6 xl:gap-10 2xl:gap-[85px]">
        {/* 좌측: 프로필 섹션 + 메뉴 - 너비: xl 330px, 2xl 365px */}
        <div className="w-full xl:w-[330px] 2xl:w-[365px] flex flex-col">
          {/* 타이틀 높이만큼 공백 추가 */}
          <div className="mb-6">
            <div className="font-bold text-[24px] xl:text-[28px] invisible">
              클럽 리뷰
            </div>
          </div>

          <UserProfile
            session={session}
            isOwner={true}
            isEditing={isProfileEditing}
            setIsEditing={setIsProfileEditing}
          />

          {/* 사이드바 메뉴 - 간격: xl 80px, 2xl 100px */}
          <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />
        </div>

        {/* 우측: 페이지 헤더 + 컨텐츠 */}
        <div className="w-full xl:w-3/4 2xl:w-[1315px] flex flex-col gap-6">
          <div className="flex flex-col">
            <Title className="text-black">클럽 리뷰</Title>
            <div className="h-[3px] bg-main mt-4 md:mt-7 lg:mt-10" />
          </div>

          {/* 클럽 리뷰 컨텐츠 영역 */}
          <div className="text-muted-foreground">
            작성한 클럽 리뷰 목록이 표시됩니다.
          </div>
        </div>
      </div>

      {/* 1024~1279px: 1열 레이아웃 */}
      <div className="hidden lg:flex xl:hidden flex-col gap-6">
        <div className="flex flex-col">
          <Title className="text-black">클럽 리뷰</Title>
          <div className="h-[3px] bg-main mt-10" />
        </div>
        <UserProfile
          session={session}
          isOwner={true}
          isEditing={isProfileEditing}
          setIsEditing={setIsProfileEditing}
        />

        {/* 클럽 리뷰 컨텐츠 영역 */}
        <div className="text-muted-foreground">
          작성한 클럽 리뷰 목록이 표시됩니다.
        </div>

        {/* 사이드바 메뉴는 가장 하단 */}
        <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />
      </div>

      {/* 1023px 이하: 모바일 레이아웃 */}
      <div className="flex lg:hidden flex-col gap-6">
        <div className="flex flex-col">
          <Title className="text-black">클럽 리뷰</Title>
          <div className="h-[3px] bg-main mt-4 md:mt-7" />
        </div>
        <UserProfile
          session={session}
          isOwner={true}
          isEditing={isProfileEditing}
          setIsEditing={setIsProfileEditing}
        />

        {/* 클럽 리뷰 컨텐츠 영역 */}
        <div className="text-muted-foreground">
          작성한 클럽 리뷰 목록이 표시됩니다.
        </div>

        {/* 사이드바 메뉴는 가장 하단 */}
        <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />
      </div>
    </PageWrapper>
  );
}
