"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user-store";

/**
 * Custom hook to require authentication for user pages
 * Redirects to login if unauthenticated
 * Returns session and loading state
 */
export function useRequireAuth() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading: false,
  };
}
