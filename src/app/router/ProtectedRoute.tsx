import { Navigate, Outlet, useLocation } from 'react-router';

import { Button } from '@/shared/ui/Button';
import PageSection from '@/shared/ui/page/PageSection';
import { useAuthStore } from '@/store';

export function ProtectedRoute() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const location = useLocation();

  if (authStatus === 'idle' || authStatus === 'checking') {
    return <p role="status">Проверяем сессию…</p>;
  }

  if (authStatus === 'error') {
    return (
      <PageSection
        paddingVertical={32}
        paddingHorizontal={40}
      >
        <p role="alert">Не удалось проверить сессию.</p>
        <Button
          text="Попробовать снова"
          onClick={() => void checkAuth()}
        />
      </PageSection>
    );
  }

  if (authStatus === 'anonymous') {
    return (
      <Navigate
        to="/?auth=login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
