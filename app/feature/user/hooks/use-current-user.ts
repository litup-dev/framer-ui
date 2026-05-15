import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOptions } from "../query-options";

export const useCurrentUser = () => {
  const isLogin =
    typeof window !== "undefined"
      ? document.cookie.includes("isLogin=true")
      : false;
  const { data, isLoading, error } = useQuery({
    ...getCurrentUserOptions(),
    enabled: isLogin,
  });

  if (error && typeof window !== "undefined") {
    document.cookie = "isLogin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  return { user: data, isLoading, error, isAuthenticated: !!data };
};
