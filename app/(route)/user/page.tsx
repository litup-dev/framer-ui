"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import UserPageContent from "@/app/shared/components/user-page-content";
import { useUserPageData } from "@/app/feature/user/hooks/use-user-page-data";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { saveReturnUrl } from "@/lib/login-utils";

export default function MyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isMounted) {
      if (typeof window !== "undefined") {
        const currentUrl = pathname + window.location.search;
        saveReturnUrl(pathname);
        router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuthenticated, router, pathname, isMounted]);

  const publicId = user?.publicId || "";
  const { userInfo, userStats } = useUserPageData(publicId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 마이페이지는 모든 권한 허용
  const permissions = {
    canViewStats: true,
    canViewPerformHistory: true,
    canViewFavoriteClubs: true,
  };

  return (
    <UserPageContent
      isOwner={true}
      permissions={permissions}
      userStats={userStats}
      viewingUserId={publicId}
      viewingUserInfo={userInfo}
    />
  );
}
