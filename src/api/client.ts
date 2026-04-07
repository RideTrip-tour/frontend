import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AxiosError } from 'axios'
import { getApiBaseUrl } from './baseUrl';
import { useAuthStore } from '@/store';
import { normalizeAxiosError, ApiError } from './errors';
import { notifyGlobal } from '@/shared/notifications/notifyBus';

const baseURL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// отдельный клиент для refresh
const refreshClient = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// refresh очередь
let isRefreshing = false;
let waiters: Array<(token: string | null) => void> = [];

function resolveWaiters(token: string | null) {
  waiters.forEach((cb) => cb(token));
  waiters = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,

  async (err: unknown) => {
    const axiosErr = err as AxiosError

    const status: number | undefined = axiosErr?.response?.status;
    const original = axiosErr?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) {
      const apiErr = normalizeAxiosError(err);
      notifyGlobal(apiErr.message);
      throw apiErr;
    }

    const url = String(original.url || '');

    // ---- не refresh кейсы ----
    if (status !== 401 || original._retry || url.includes('/auth/refresh')) {
      const apiErr = normalizeAxiosError(err);

      if (apiErr.status && apiErr.status >= 500) {
        notifyGlobal(apiErr.message);
      }

      if (apiErr.code === 'NETWORK' || apiErr.code === 'TIMEOUT') {
        notifyGlobal(apiErr.message);
      }

      throw apiErr;
    }

    original._retry = true;

    // ---- refresh уже выполняется ----
    if (isRefreshing) {
      const token = await new Promise<string | null>((resolve) => waiters.push(resolve));

      if (!token) {
        useAuthStore.getState().logout();
        const apiErr = new ApiError('Session expired', { status: 401 });
        notifyGlobal(apiErr.message);
        throw apiErr;
      }

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${token}`;

      return apiClient(original);
    }

    // ---- запускаем refresh ----
    isRefreshing = true;

    try {
      const res = await refreshClient.post('/auth/refresh', {});

      const newToken: string | undefined = res.data?.token;

      if (!newToken) {
        resolveWaiters(null);
        useAuthStore.getState().logout();

        const apiErr = new ApiError('Session expired', {
          status: 401
        });

        notifyGlobal(apiErr.message);
        throw apiErr;
      }

      const prevUser = useAuthStore.getState().user;

      useAuthStore.getState().login({
        token: newToken,
        user: res.data?.user ?? prevUser
      });

      resolveWaiters(newToken);

      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newToken}`;

      return apiClient(original);
    } catch (e) {
      resolveWaiters(null);
      useAuthStore.getState().logout();

      const apiErr = normalizeAxiosError(e);
      notifyGlobal(apiErr.message);

      throw apiErr;
    } finally {
      isRefreshing = false;
    }
  }
);
