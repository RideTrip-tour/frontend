import { useEffect } from 'react';

import { initProfile } from '@/services/initProfile';
import { useAuthStore, useProfileStore } from '@/store';

export const useInitProfile = (): void => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const user = useAuthStore((state) => state.user);
  const resetProfile = useProfileStore((state) => state.reset);

  useEffect(() => {
    if (authStatus === 'checking') {
      return;
    }

    if (authStatus === 'anonymous' || !user) {
      resetProfile();
      return;
    }

    void initProfile(user);
  }, [authStatus, user, resetProfile]);
};