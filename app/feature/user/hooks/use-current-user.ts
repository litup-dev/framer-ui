import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOptions } from "../query-options";

export const useCurrentUser = () => {
  // 쿠키에서 isLogin 값을 읽어와서 반환하는 로직을 구현합니다.
  const isLogin =
    typeof window !== "undefined"
      ? document.cookie.includes("isLogin=true")
      : false;
  return useQuery({ ...getCurrentUserOptions(), enabled: isLogin });
};
