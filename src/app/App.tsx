import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { AppRouter } from '@/app/router';
import { Header, Footer } from '@/components';
import { useInitProfile } from '@/hooks';
import { useAuthStore } from '@/store';

const PUBLIC_AUTH_PATHS = new Set(['/login', '/register', '/auth', '/auth/verify', '/users/me']);

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const location = useLocation();
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.has(location.pathname);
  useInitProfile();

  useEffect(() => {
    document.body.dataset.theme = 'light';

    if (isPublicAuthRoute) {
      return;
    }

    void checkAuth();
  }, [checkAuth, isPublicAuthRoute]);

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
