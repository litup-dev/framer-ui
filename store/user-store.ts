import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  publicId: string;
  nickname: string;
  email?: string;
  profilePath?: string | null;
  bio?: string;
  socialCode?: string; // "google" | "kakao"
  socialName?: string; // "Google" | "카카오"
  token?: string;
}

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          // hydration 성공 시 상태 업데이트
          // 실제로 데이터가 복원되었는지 확인
          const hasData = !!(state.user || state.isAuthenticated);
          state.setHasHydrated(true);
          
          // 만약 localStorage에 데이터가 있는데 store에 반영되지 않았다면 수동으로 복원
          if (!hasData && typeof window !== "undefined") {
            try {
              const stored = localStorage.getItem("user-storage");
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.state && parsed.state.user) {
                  // 수동으로 복원
                  state.setUser(parsed.state.user);
                }
              }
            } catch (e) {
              console.error("Failed to restore from localStorage:", e);
            }
          }
        } else {
          // hydration 실패 시에도 완료로 간주
          if (state) {
            state.setHasHydrated(true);
          }
        }
      },
    }
  )
);
