import { useEffect } from 'react';

import { AppRouter } from '@/app/router';
import { Header, Footer } from '@/components';
import { useInitProfile } from '@/hooks';
import { useAuthStore } from '@/store';

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  useInitProfile();

  useEffect(() => {
    checkAuth();
    document.body.dataset.theme = 'light';
  }, [checkAuth]);

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
