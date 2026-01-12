"use client";

import { useEffect } from "react";
import { checkAuthStatus } from "@/lib/auth-utils";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  return <>{children}</>;
};
