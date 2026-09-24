import { create } from "zustand";
import { persist } from "zustand/middleware";
import { meRequest } from "@/services/authService";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
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
