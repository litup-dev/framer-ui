"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import FadeIn from "@/components/shared/fade-in";
import LoginForm from "@/app/feature/login/components/login-form";
import { getReturnUrl } from "@/lib/login-utils";

const LoginPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const returnUrl = searchParams.get("returnUrl");
      if (returnUrl) {
        sessionStorage.setItem("login-return-url", returnUrl);
      } else {
        const existingReturnUrl = getReturnUrl();
        if (!existingReturnUrl) {
          const referrer = document.referrer;
          if (referrer && !referrer.includes("/login")) {
            try {
              const referrerUrl = new URL(referrer);
              const currentOrigin = window.location.origin;
              if (referrerUrl.origin === currentOrigin) {
                const returnPath = referrerUrl.pathname + referrerUrl.search;
                if (
                  returnPath !== "/login" &&
                  returnPath !== "/login/success"
                ) {
                  sessionStorage.setItem("login-return-url", returnPath);
                }
              }
            } catch (e) {
              // Failed to parse referrer URL
            }
          }
        }
      }
    }
  }, [searchParams]);

  return (
    <FadeIn>
      <LoginForm />
    </FadeIn>
  );
};

export default LoginPage;
