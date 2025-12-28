"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Title } from "@/components/shared/typography";
import { MyPageMenuItems } from "@/app/shared/constants";

interface UserSidebarMenuProps {
  className?: string;
}

// 뷰포트 전체 너비 구분선 컴포넌트
const FullWidthDivider = () => (
  <div className="h-3 bg-[#F5F5F5] xl:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" />
);

export default function UserSidebarMenu({ className }: UserSidebarMenuProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col w-full ${className || ""}`}>
      <FullWidthDivider />

      <div className="flex flex-col xl:gap-14">
        {MyPageMenuItems.map((item, index) => (
          <div key={item.id}>
            {index > 0 && <FullWidthDivider />}

            <div className="py-8 md:py-8 lg:py-10 xl:p-0">
              <Title className="text-[16px] xl:text-[20px] text-muted-foreground xl:text-black">
                {item.label}
              </Title>

              <div className="flex flex-col gap-8 md:gap-8 lg:gap-10 xl:gap-6 mt-8 md:mt-8 lg:mt-10 xl:mt-6">
                {item.subItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`inline-block font-bold text-left xl:text-[16px] xl:text-muted-foreground hover:text-muted-foreground xl:hover:text-black transition-colors w-fit ${
                        isActive ? "border-b-2 border-black pb-px" : ""
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
