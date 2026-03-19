"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getReturnUrl, clearReturnUrl } from "@/lib/login-utils";
import { getCurrentUserOptions } from "@/app/feature/user/query-options";
import { getQueryClient } from "@/providers/get-query-client";

const LoginSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 로그인 시 isLogin 체크 후 유저 정보 조회
    const queryClient = getQueryClient();
    queryClient.prefetchQuery(getCurrentUserOptions());

    const returnUrl = getReturnUrl();
    if (returnUrl && returnUrl !== "/login" && returnUrl !== "/login/success") {
      clearReturnUrl();
      router.replace(returnUrl);
    } else {
      router.replace("/home");
    }
  }, [router]);

  return null;
};

export default LoginSuccessPage;
