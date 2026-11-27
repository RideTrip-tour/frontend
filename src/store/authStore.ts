import { create } from 'zustand';

import { meRequest, type CurrentUser } from '@/services/usersService';
import { handleApiError } from '@/shared/api/errors';
import {
  advanceSessionVersion,
  getPendingSessionTransition,
  getSessionVersion,
  setSessionExpiredHandler,
} from '@/shared/api/sessionEvents';

type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'anonymous' | 'error';

type AuthState = {
  user: CurrentUser | null;
  isAuth: boolean;
  authStatus: AuthStatus;

  setUser: (user: CurrentUser) => void;
  logout: () => void;
  checkAuth: () => Promise<CurrentUser | null>;
};

let pendingAuthCheck: {
  version: number;
  promise: Promise<CurrentUser | null>;
} | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuth: false,
  authStatus: 'idle',

  setUser: (user) => {
    advanceSessionVersion();
    pendingAuthCheck = null;

    set({
      user,
      isAuth: true,
      authStatus: 'authenticated',
    });
  },

  logout: () => {
    advanceSessionVersion();
    pendingAuthCheck = null;

    set({
      user: null,
      isAuth: false,
      authStatus: 'anonymous',
    });
  },

  checkAuth: () => {
    const transition = getPendingSessionTransition();

    if (transition) {
      return transition.then(() => get().checkAuth());
    }

    if (get().authStatus === 'authenticated' || get().authStatus === 'anonymous') {
      return Promise.resolve(get().user);
    }

    const version = getSessionVersion();

    if (pendingAuthCheck?.version === version) {
      return pendingAuthCheck.promise;
    }

    const promise = (async () => {
      set({ authStatus: 'checking' });

      try {
        const user = await meRequest({ authContext: 'bootstrap', sessionVersion: version });

        if (version !== getSessionVersion()) {
          return get().checkAuth();
        }

        get().setUser(user);

        return user;
      } catch (error) {
        if (version !== getSessionVersion()) {
          return get().checkAuth();
        }

        if (handleApiError(error).status === 401) {
          get().logout();
        } else {
          set({ user: null, isAuth: false, authStatus: 'error' });
        }

        return null;
      } finally {
        if (pendingAuthCheck?.version === version) {
          pendingAuthCheck = null;
        }
      }
    })();

    pendingAuthCheck = { version, promise };
    return promise;
  },
}));

setSessionExpiredHandler(() => {
  const { isAuth, logout } = useAuthStore.getState();
  logout();
  return isAuth;
});
