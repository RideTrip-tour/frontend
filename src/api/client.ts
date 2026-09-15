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

const refreshClient = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

let isRefreshing = false;
let waiters: Array<() => void> = [];

function resolveWaiters() {
  waiters.forEach((cb) => cb());
  waiters = [];
}

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

    if (isRefreshing) {
      const ok = await new Promise<boolean>((resolve) => waiters.push(() => resolve(true)));
      if (!ok) {
        useAuthStore.getState().logout();
        const apiErr = new ApiError('Session expired', { status: 401 });
        notifyGlobal(apiErr.message);
        throw apiErr;
      }
      return apiClient(original);
    }

    isRefreshing = true;

    try {
      await refreshClient.post('/auth/refresh', {});
      resolveWaiters();
      return apiClient(original);
    } catch (e) {
      resolveWaiters();
      useAuthStore.getState().logout();
      const apiErr = normalizeAxiosError(e);
      notifyGlobal(apiErr.message);
      throw apiErr;
    } finally {
      isRefreshing = false;
    }
  }
);
