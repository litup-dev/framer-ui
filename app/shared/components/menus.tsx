"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getQueryClient } from "@/providers/get-query-client";

import { MenuItems } from "@/app/shared/constants";
import Image from "next/image";
import { saveReturnUrl } from "@/lib/login-utils";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";

const HeaderMenus = ({
  isWhiteIcons = false,
  isWhiteIconsOnXl = false,
  scrollProgress,
}: {
  isWhiteIcons?: boolean;
  isWhiteIconsOnXl?: boolean;
  scrollProgress?: number;
}) => {
  const { user, isLogin } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const queryClient = getQueryClient();

  const handleLoginClick = () => {
    saveReturnUrl(pathname);
  };

  const handleLogout = async () => {
    await apiClient.post("/api/v1/auth/logout", {});
    queryClient.clear();
    router.push("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex gap-10 xl:gap-15 items-center">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href}>
          <span className="font-semibold lg:text-[16px] 2xl:text-[20px]">
            {item.label}
          </span>
        </Link>
      ))}

      {!mounted ? (
        // 서버 렌더 시점엔 로그인 여부를 몰라서(쿠키는 클라이언트에서만 확인) 아무것도 그리지 않고
        // 자리만 잡는다. 로그아웃 상태 사용자에게 로그인용 아이콘 스켈레톤이 보이지 않게 한다.
        <div className="flex gap-4 invisible" aria-hidden>
          <div className="w-6 h-6 2xl:w-7 2xl:h-7" />
          <div className="w-6 h-6 2xl:w-7 2xl:h-7" />
        </div>
      ) : user ? (
        <div className="flex gap-4 items-center">
          <Image
            src="/images/header-user.png"
            alt={user.nickname}
            width={28}
            height={28}
            onClick={() => router.push("/user")}
            className={cn(
              "cursor-pointer w-6 h-6 2xl:w-7 2xl:h-7",
              scrollProgress === undefined &&
                (isWhiteIcons || isWhiteIconsOnXl) &&
                "brightness-0 invert",
            )}
            style={
              scrollProgress !== undefined
                ? {
                    filter: `brightness(0) invert(${1 - scrollProgress})`,
                  }
                : undefined
            }
          />
          <Image
            src={"/images/logout.svg"}
            width={28}
            height={28}
            alt="logout"
            onClick={handleLogout}
            className={cn(
              "cursor-pointer w-6 h-6 2xl:w-7 2xl:h-7",
              scrollProgress === undefined &&
                (isWhiteIcons || isWhiteIconsOnXl) &&
                "brightness-0 invert",
            )}
            style={
              scrollProgress !== undefined
                ? {
                    filter: `brightness(0) invert(${1 - scrollProgress})`,
                  }
                : undefined
            }
          />
        </div>
      ) : isLogin ? (
        // 로그인 쿠키는 있고 유저 정보를 불러오는 중: 로그인 후 모습(아이콘 2개)과 같은 크기의 스켈레톤
        <div className="flex gap-4">
          <div className="w-6 h-6 2xl:w-7 2xl:h-7 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-6 h-6 2xl:w-7 2xl:h-7 bg-gray-200 rounded-full animate-pulse" />
        </div>
      ) : (
        <Link
          href="/login"
          className="font-semibold"
          onClick={handleLoginClick}
        >
          <span className="text-[16px] 2xl:text-[20px]">로그인</span>
        </Link>
      )}
    </div>
  );
};

export default HeaderMenus;
