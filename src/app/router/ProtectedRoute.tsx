import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '@/store';

export function ProtectedRoute() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const location = useLocation();

  if (authStatus === 'checking') {
    return <div>Loading...</div>;
  }

  if (authStatus === 'anonymous') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}