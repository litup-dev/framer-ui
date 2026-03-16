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
  return { user: data, isLoading, error, isAuthenticated: !!data };
};
