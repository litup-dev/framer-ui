"use client";

import { useEffect } from "react";
import { checkAuthStatus } from "@/lib/auth-utils";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 앱 초기화 시 localStorage의 토큰을 확인하고
 * 유효하면 사용자 정보를 store에 로드
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  return <>{children}</>;
};
