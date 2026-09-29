import { create } from "zustand";
import { persist } from "zustand/middleware";
import { meRequest } from "@/services/usersService";
import type { CurrentUser } from "@/services/usersService";
import { setSessionExpiredHandler } from "@/shared/api/sessionEvents";

type AuthState = {
  user: CurrentUser | null;
  isAuth: boolean;
  isLoading: boolean;

  setUser: (user: CurrentUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuth: true });
      },

      logout: () => {
        set({
          user: null,
          isAuth: false
        });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const user = await meRequest();
          set({ user, isAuth: true });
        } catch {
          set({ user: null, isAuth: false });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuth: state.isAuth
      })
    }
  )
);

setSessionExpiredHandler(() => useAuthStore.getState().logout());
