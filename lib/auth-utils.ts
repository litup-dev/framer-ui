import { apiClient } from "./api-client";
import { useUserStore, type UserInfo } from "@/store/user-store";

interface UserInfoResponse {
  data: UserInfo;
  message: string;
}

/**
 * 로그아웃: next-auth 세션과 store 클리어
 */
export const logout = async (): Promise<void> => {
  const { clearUser } = useUserStore.getState();
  clearUser();
};

/**
 * 현재 로그인 상태 확인 및 사용자 정보 재조회 (next-auth 세션 사용)
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const { user } = useUserStore.getState();
    if (!user?.publicId) {
      await logout();
      return false;
    }

    const response = await apiClient.get<UserInfoResponse>(
      `/api/v1/users/${user.publicId}`
    );
    const { setUser } = useUserStore.getState();
    setUser(response.data);
    return true;
  } catch (error) {
    await logout();
    return false;
  }
};
