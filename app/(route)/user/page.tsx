"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import UserPageContent from "@/app/shared/components/user-page-content";
import { useUserStore } from "@/store/user-store";
import { useUserPageData } from "@/app/feature/user/hooks/use-user-page-data";
import { saveReturnUrl } from "@/lib/login-utils";

export default function MyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const currentUrl = pathname + window.location.search;
        saveReturnUrl(pathname);
        router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router, pathname]);

  const publicId = user?.publicId || "";
  const { userInfo, userStats, isLoading } = useUserPageData(publicId);

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
