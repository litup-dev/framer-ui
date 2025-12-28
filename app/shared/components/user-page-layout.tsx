"use client";

import { ReactNode, useState } from "react";
import { Session } from "next-auth";
import PageWrapper from "@/app/shared/components/page-wrapper";
import UserProfile from "@/app/feature/user/components/user-profile";
import UserSidebarMenu from "@/app/feature/user/components/user-sidebar-menu";
import { Title } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface UserPageLayoutProps {
  session: Session;
  title: string;
  children: ReactNode;
  contentTopMargin?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
  };
}

export default function UserPageLayout({
  session,
  title,
  children,
  contentTopMargin = {
    sm: "mt-10",
    md: "md:mt-12",
    lg: "lg:mt-12",
    xl: "xl:mt-12",
    "2xl": "2xl:mt-20",
  },
}: UserPageLayoutProps) {
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  return (
    <PageWrapper className="pt-6 2xl:pt-[124px]">
      {/* 1280px 이상 (xl+): 2열 레이아웃 - 프로필 영역 표시 */}
      <div className="hidden xl:flex xl:flex-row gap-6 xl:gap-10 2xl:gap-[85px]">
        {/* 좌측: 프로필 섹션 + 메뉴 */}
        <div className="w-full xl:w-[330px] 2xl:w-[365px] flex flex-col">
          <div className="mb-6">
            <Title className="xl:text-[32px] 2xl:text-[40px] invisible">
              {title}
            </Title>
          </div>

          <UserProfile
            session={session}
            isOwner={true}
            isEditing={isProfileEditing}
            setIsEditing={setIsProfileEditing}
          />

          <UserSidebarMenu className="xl:mt-20 2xl:mt-[100px]" />
        </div>

        {/* 우측: 페이지 헤더 + 컨텐츠 */}
        <div className="w-full xl:w-3/4 2xl:w-[1315px] flex flex-col">
          <div className="flex flex-col">
            <Title className="xl:text-[32px] 2xl:text-[40px]">{title}</Title>
            <Separator className="!h-[2px] md:!h-[3px] bg-main mt-4 md:mt-7 lg:mt-10" />
          </div>
          <div
            className={cn(
              contentTopMargin?.sm,
              contentTopMargin?.md,
              contentTopMargin?.lg,
              contentTopMargin?.xl,
              contentTopMargin?.["2xl"]
            )}
          >
            {children}
          </div>
        </div>
      </div>

      {/* 1279px 이하 (xl-): 1열 레이아웃 - 프로필 영역 숨김 */}
      <div className="flex xl:hidden flex-col">
        <div className="flex flex-col">
          <Title className="text-[20px] md:text-[24px] lg:text-[32px]">
            {title}
          </Title>
          <Separator className="!h-[2px] md:!h-[3px] bg-main mt-4 md:mt-7 lg:mt-10" />
        </div>
        <div
          className={cn(
            contentTopMargin?.sm,
            contentTopMargin?.md,
            contentTopMargin?.lg,
            contentTopMargin?.xl,
            contentTopMargin?.["2xl"]
          )}
        >
          {children}
        </div>
        <UserSidebarMenu className="mt-12 md:mt-16 lg:mt-20" />
      </div>
    </PageWrapper>
  );
}
