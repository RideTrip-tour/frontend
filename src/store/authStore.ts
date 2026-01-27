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
  token: string | null;
  isAuth: boolean;
  isLoading: boolean;

  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuth: false,
      isLoading: false,

      login: ({ user, token }) => {
        set({
          user,
          token,
          isAuth: true
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuth: false
        });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          const token = get().token;
          if (!token) {
            set({ isAuth: false, user: null });
            return;
          }

          const user = await meRequest();
          set({ user, isAuth: true });
        } catch {
          set({ user: null, token: null, isAuth: false });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "auth-storage", //TODO ключ в localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuth: state.isAuth
      })
    }
  )
);
