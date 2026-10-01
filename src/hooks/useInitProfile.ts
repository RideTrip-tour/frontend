import { useEffect } from 'react';

import { initProfile } from '@/services/initProfile';
import { useAuthStore, useProfileStore } from '@/store';

export const useInitProfile = (): void => {
  const isAuth = useAuthStore((s) => s.isAuth);
  const resetProfile = useProfileStore((s) => s.reset);

  useEffect(() => {
    let cancelled = false;

    if (!isAuth) {
      resetProfile();
      return () => {
        cancelled = true;
      };
    }

    initProfile().catch(() => {
      if (!cancelled) {
        // silent — initProfile логирует сам, если нужно
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAuth, resetProfile]);
};
