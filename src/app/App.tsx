import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { AppRouter } from '@/app/router';
import { Header, Footer } from '@/components';
import { isPublicAuthRoute } from '@/features/auth/model/authRoutes';
import { useInitProfile } from '@/hooks';
import { useAuthStore } from '@/store';

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const location = useLocation();
  const deferSessionCheck = isPublicAuthRoute(location.pathname, location.search);
  useInitProfile();

  useEffect(() => {
    document.body.dataset.theme = 'light';

    if (deferSessionCheck) {
      return;
    }

    void checkAuth();

    const retryOnReconnect = () => {
      if (useAuthStore.getState().authStatus === 'error') void checkAuth();
    };
    window.addEventListener('online', retryOnReconnect);
    return () => window.removeEventListener('online', retryOnReconnect);
  }, [checkAuth, deferSessionCheck]);

  return (
    <>
      <Header />

      <main>
        <AppRouter />
      </main>

      <Footer />
    </>
  );
}
