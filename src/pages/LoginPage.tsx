import { Navigate } from 'react-router';

export function LoginPage() {
  return <Navigate to="/?auth=login" replace />;
}
