import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  nickname: string;
  is_superuser: boolean;
}

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // 🔐 localStorage에 저장될 키 이름
      partialize: (state) => ({ user: state.user }), // 저장할 항목 제한
    }
  )
);
