import { matchPath } from 'react-router';

export const AUTH_PATHS = {
  login: '/login',
  register: '/register',
  verify: '/auth/verify',
  resetPassword: '/reset-password',
} as const;

export function getAuthView(param: string | null) {
  return param === 'login' || param === 'register' || param === 'forgot' ? param : null;
}

export function isPublicAuthRoute(pathname: string, search: string) {
  if (Object.values(AUTH_PATHS).some((path) => matchPath(path, pathname))) return true;
  if (pathname !== '/') return false;

  const params = new URLSearchParams(search);
  return params.has('verify_token') || getAuthView(params.get('auth')) !== null;
}
