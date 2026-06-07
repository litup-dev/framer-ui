"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getReturnUrl, clearReturnUrl } from "@/lib/login-utils";
import { getCurrentUserOptions } from "@/app/feature/user/query-options";
import { getQueryClient } from "@/providers/get-query-client";
import { apiClient } from "@/lib/api-client";

const LoginSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    const exchangeAndRedirect = async () => {
      if (code) {
        await apiClient.post("/api/v1/auth/exchange", { code });
      }

      const queryClient = getQueryClient();
      queryClient.prefetchQuery(getCurrentUserOptions());

      const returnUrl = getReturnUrl();
      if (returnUrl && returnUrl !== "/login" && returnUrl !== "/login/success") {
        clearReturnUrl();
        router.replace(returnUrl);
      } else {
        router.replace("/home");
      }
    };

    exchangeAndRedirect();
  }, [router, searchParams]);

  return null;
};

const LoginSuccessPage = () => (
  <Suspense>
    <LoginSuccessContent />
  </Suspense>
);

export default LoginSuccessPage;
