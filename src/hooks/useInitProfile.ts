import { useEffect } from 'react';

import { initProfile } from '@/services/initProfile';
import { useAuthStore, useProfileStore } from '@/store';

export const useInitProfile = (): void => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const user = useAuthStore((state) => state.user);
  const resetProfile = useProfileStore((state) => state.reset);

  useEffect(() => {
    if (authStatus === 'anonymous') {
      resetProfile();
      return;
    }

    if (authStatus !== 'authenticated' || !user) return;

    const controller = new AbortController();
    void initProfile(user, controller.signal);
    return () => controller.abort();
  }, [authStatus, user, resetProfile]);
};
