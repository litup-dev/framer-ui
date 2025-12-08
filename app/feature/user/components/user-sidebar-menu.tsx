"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  subItems: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "나의 활동",
    subItems: [
      { label: "클럽 리뷰", href: "/user/reviews" },
      { label: "공연 코멘트", href: "/user/comments" },
    ],
  },
  {
    label: "나의 정보",
    subItems: [
      { label: "공개범위 설정", href: "/user/privacy" },
      { label: "회원정보관리", href: "/user/settings" },
    ],
  },
];

interface UserSidebarMenuProps {
  className?: string;
}

export default function UserSidebarMenu({ className }: UserSidebarMenuProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {/* 상단 구분선 - xl 이상에서 숨김, 뷰포트 전체 너비 */}
      <div className="h-3 bg-[#F5F5F5] xl:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" />

      {/* 메뉴 콘텐츠 */}
      <div className="flex flex-col xl:gap-14">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* 메뉴 블록 사이 구분선 - xl 이상에서 숨김, 뷰포트 전체 너비 */}
            {index > 0 && (
              <div className="h-3 bg-[#F5F5F5] xl:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" />
            )}

            {/* 각 메뉴 블록 - padding: lg 상하40 좌우60, md 상하32 좌우40, sm 상하32 좌우20, xl padding 없음 */}
            <div className="py-8 px-5 md:py-8 md:px-10 lg:py-10 lg:px-[60px] xl:p-0">
              <div className="flex flex-col">
                {/* 메뉴 제목 */}
                <div className="text-sm font-medium text-black">{item.label}</div>

                {/* 서브 메뉴 - 대메뉴↔소메뉴 간격: xl/2xl 24px, lg 40px, md/sm 32px */}
                {/* 소메뉴 간 간격: xl/2xl 24px, lg 40px, md/sm 32px */}
                <div className="flex flex-col gap-8 md:gap-8 lg:gap-10 xl:gap-6 mt-8 md:mt-8 lg:mt-10 xl:mt-6">
                  {item.subItems.map((subItem, subIndex) => {
                    const isActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`inline-block text-left text-sm text-muted-foreground hover:text-black transition-colors w-fit ${
                          isActive ? "border-b-2 border-black font-medium pb-px" : ""
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
