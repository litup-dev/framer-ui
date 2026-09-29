"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/app/feature/user/hooks/use-current-user";
import { saveReturnUrl } from "@/lib/login-utils";

// 페이지 진입 시 비로그인이면 로그인 페이지로 리다이렉트
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      saveReturnUrl(pathname);
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return { isAuthenticated, isLoading };
}
