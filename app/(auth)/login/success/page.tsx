'use client'

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/user-store";
import { apiClient } from "@/lib/api-client";

const LoginSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const publicId = searchParams.get("publicId");
    const nickname = searchParams.get("nickname");
    const profilePath = searchParams.get("profilePath");

    if (!token || !publicId) return;

    setUser({
      publicId,
      nickname: nickname!,
      profilePath: profilePath || null,
      token,
    });

    apiClient.setAccessToken?.(token);

    router.replace("/home");
  }, [router, searchParams, setUser]);

  return null;
};

export default LoginSuccessPage;