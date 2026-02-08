"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { saveReturnUrl } from "@/lib/login-utils";

export function useRequireAuth() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

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

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
}
