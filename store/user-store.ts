import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  publicId: string;
  id: string;
  nickname: string;
  email?: string;
  profilePath?: string;
  bio?: string;
  provider?: string;
}

interface UserState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
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
    }),
    {
      name: "user-storage",
    }
  )
);
