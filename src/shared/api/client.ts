import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { notifySessionExpired } from '@/shared/api/sessionEvents';
import { notifyGlobal } from '@/shared/notifications/notifyBus';
import { getApiBaseUrl } from './baseUrl';
import { normalizeAxiosError } from './errors';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const clientConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 10_000,
  withCredentials: true,
  headers: { Accept: 'application/json' }
};

export const apiClient = axios.create(clientConfig);

// Refresh не проходит через interceptor основного клиента.
const refreshClient = axios.create(clientConfig);
let refreshPromise: Promise<void> | null = null;

const withoutRefresh = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/request-verify-token',
  '/auth/verify',
  '/auth/logout',
  '/auth/refresh'
]);

function canRefresh(url: string | undefined): boolean {
  const path = (url ?? '').split('?')[0].replace(/\/+$/, '').replace(/^\/api(?=\/|$)/, '');
  return !withoutRefresh.has(path);
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshClient.post('/auth/refresh', {})
      .then(() => undefined)
      .catch((error: unknown) => {
        notifySessionExpired();
        const apiError = normalizeAxiosError(error);
        notifyGlobal(apiError.message);
        throw apiError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Отменённый запрос не является сетевой ошибкой для пользователя.
    if (axios.isCancel(error)) throw error;

    const original = axios.isAxiosError(error)
      ? error.config as RetryConfig | undefined
      : undefined;
    const apiError = normalizeAxiosError(error);

    if (original && apiError.status === 401 && !original._retry && canRefresh(original.url)) {
      original._retry = true;
      // При ошибке общего refresh все ожидающие запросы отклоняются без повтора.
      await refreshSession();
      return apiClient(original);
    }

    if (apiError.status === 401 && original?._retry) {
      notifySessionExpired();
    }

    if (apiError.code === 'NETWORK' || apiError.code === 'TIMEOUT' || (apiError.status ?? 0) >= 500) {
      notifyGlobal(apiError.message);
    }

    throw apiError;
  }
);
