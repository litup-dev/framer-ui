"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to require authentication for user pages
 * Redirects to login if unauthenticated
 * Returns session and loading state
 */
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return {
    session,
    status,
    isLoading: status === "loading",
  };
}
