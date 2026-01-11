import { apiClient } from "./api-client";
import { useUserStore, type UserInfo } from "@/store/user-store";

interface UserInfoResponse {
  data: UserInfo;
  message: string;
}

/**
 * accessToken을 localStorage에 저장하고 사용자 정보를 조회하여 store에 저장
 */
export const loginWithToken = async (
  accessToken: string,
  userId: number
): Promise<UserInfo> => {
  try {
    localStorage.setItem("accessToken", accessToken);

    const response = await apiClient.get<UserInfoResponse>(
      `/api/v1/users/${userId}`
    );

    const { setUser } = useUserStore.getState();
    setUser(response.data);

    return response.data;
  } catch (error) {
    localStorage.removeItem("accessToken");
    throw error;
  }
};

/**
 * 로그아웃: localStorage와 store 클리어
 */
export const logout = (): void => {
  localStorage.removeItem("accessToken");
  const { clearUser } = useUserStore.getState();
  clearUser();
};

/**
 * 현재 로그인 상태 확인 및 사용자 정보 재조회
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    const { clearUser } = useUserStore.getState();
    clearUser();
    return false;
  }

  try {
    const { user } = useUserStore.getState();
    if (!user?.publicId) {
      logout();
      return false;
    }

    const response = await apiClient.get<UserInfoResponse>(
      `/api/v1/users/${user.publicId}`
    );
    const { setUser } = useUserStore.getState();
    setUser(response.data);
    return true;
  } catch (error) {
    logout();
    return false;
  }
};
