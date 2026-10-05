import { create } from 'zustand';

import { meRequest, type CurrentUser } from '@/services/usersService';
import { setSessionExpiredHandler } from '@/shared/api/sessionEvents';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

type AuthState = {
  user: CurrentUser | null;
  isAuth: boolean;
  authStatus: AuthStatus;

  setUser: (user: CurrentUser) => void;
  logout: () => void;
  checkAuth: () => Promise<CurrentUser | null>;
};

let authCheckPromise: Promise<CurrentUser | null> | null = null;
let authBootstrapCompleted = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuth: false,
  authStatus: 'checking',

  setUser: (user) => {
    authBootstrapCompleted = true;

    set({
      user,
      isAuth: true,
      authStatus: 'authenticated',
    });
  },

  logout: () => {
    authBootstrapCompleted = true;

    set({
      user: null,
      isAuth: false,
      authStatus: 'anonymous',
    });
  },

  checkAuth: () => {
    if (authBootstrapCompleted) {
      return Promise.resolve(get().user);
    }

    if (authCheckPromise) {
      return authCheckPromise;
    }

    authCheckPromise = (async () => {
      set({ authStatus: 'checking' });

      try {
        const user = await meRequest();

        set({
          user,
          isAuth: true,
          authStatus: 'authenticated',
        });

        return user;
      } catch {
        set({
          user: null,
          isAuth: false,
          authStatus: 'anonymous',
        });

        return null;
      } finally {
        authBootstrapCompleted = true;
        authCheckPromise = null;
      }
    })();

    return authCheckPromise;
  },
}));

setSessionExpiredHandler(() => {
  useAuthStore.getState().logout();
});