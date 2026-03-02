"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Title } from "@/components/shared/typography";
import { MyPageMenuItems } from "@/app/shared/constants";

interface UserSidebarMenuProps {
  className?: string;
}

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
              <Title className="text-[16px] xl:text-[20px] text-muted-foreground xl:text-black tracking-[-0.04em]">
                {item.label}
              </Title>

              <div className="flex flex-col gap-8 md:gap-8 lg:gap-10 xl:gap-6 mt-8 md:mt-8 lg:mt-10 xl:mt-6">
                {item.subItems.map((subItem) => {
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`inline-block font-bold text-left xl:text-[16px] tracking-[-0.04em] hover:text-muted-foreground transition-colors w-fit ${
                        isActive
                          ? "border-b-2 border-black pb-px xl:text-black 2xl:text-black"
                          : "xl:text-[#171717]/40 2xl:text-[#171717]/40 xl:hover:text-black 2xl:hover:text-black"
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
