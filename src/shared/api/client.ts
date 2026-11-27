import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import {
  getPendingSessionTransition,
  getSessionVersion,
  notifySessionExpired,
} from '@/shared/api/sessionEvents';
import { notifyGlobal } from '@/shared/notifications/notifyBus';

import { getApiBaseUrl } from './baseUrl';
import { normalizeAxiosError } from './errors';

export type SessionRequestOptions = {
  authContext?: 'bootstrap' | 'form';
  sessionVersion?: number;
};

type RetryConfig = InternalAxiosRequestConfig &
  SessionRequestOptions & {
    _retry?: boolean;
  };

type PendingRefresh = {
  version: number;
  notifyErrors: boolean;
  promise: Promise<void>;
};

const clientConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 10_000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
};

export const apiClient = axios.create(clientConfig);

// Refresh не проходит через interceptor основного клиента.
const refreshClient = axios.create(clientConfig);

let pendingRefresh: PendingRefresh | null = null;

const withoutRefresh = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/request-verify-token',
  '/auth/verify',
  '/auth/logout',
  '/auth/refresh',
]);

function trimTrailingSlashes(value: string): string {
  let end = value.length;

  while (end > 0 && value[end - 1] === '/') {
    end -= 1;
  }

  return value.slice(0, end);
}

function removeApiPrefix(path: string): string {
  if (path === '/api') {
    return '';
  }

  return path.startsWith('/api/') ? path.slice('/api'.length) : path;
}

function canRefresh(url: string | undefined): boolean {
  const [rawPath = ''] = (url ?? '').split('?', 1);
  const path = removeApiPrefix(trimTrailingSlashes(rawPath));

  return !withoutRefresh.has(path);
}

function isCurrentSession(config: RetryConfig): boolean {
  return config.sessionVersion === getSessionVersion();
}

function shouldNotifyErrors(config: RetryConfig | undefined): boolean {
  return config?.authContext === undefined;
}

function expireSession(version: number, notifyErrors: boolean): void {
  const wasAuthenticated = notifySessionExpired(version);

  if (wasAuthenticated && notifyErrors) {
    notifyGlobal('Сессия завершена. Войдите снова.');
  }
}

function isTechnicalError(error: ReturnType<typeof normalizeAxiosError>): boolean {
  return error.code === 'NETWORK' || error.code === 'TIMEOUT' || (error.status ?? 0) >= 500;
}

function refreshSession(config: RetryConfig): Promise<void> {
  const version = config.sessionVersion ?? getSessionVersion();
  const notifyErrors = shouldNotifyErrors(config);

  if (pendingRefresh?.version === version) {
    pendingRefresh.notifyErrors ||= notifyErrors;
    return pendingRefresh.promise;
  }

  const refresh: PendingRefresh = {
    version,
    notifyErrors,
    promise: Promise.resolve(),
  };

  refresh.promise = refreshClient
    .post('/auth/refresh')
    .then(() => undefined)
    .catch((error: unknown) => {
      const apiError = normalizeAxiosError(error);

      if (version === getSessionVersion()) {
        if (apiError.status === 401) {
          expireSession(version, refresh.notifyErrors);
        } else if (refresh.notifyErrors && isTechnicalError(apiError)) {
          notifyGlobal(apiError.message);
        }
      }

      throw apiError;
    })
    .finally(() => {
      if (pendingRefresh === refresh) {
        pendingRefresh = null;
      }
    });

  pendingRefresh = refresh;
  return refresh.promise;
}

apiClient.interceptors.request.use(
  (config) => {
    const sessionConfig = config as RetryConfig;
    sessionConfig.sessionVersion ??= getSessionVersion();
    return config;
  },
  undefined,
  { synchronous: true },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Отменённый запрос не является сетевой ошибкой для пользователя.
    if (axios.isCancel(error)) {
      throw error;
    }

    const original = axios.isAxiosError(error)
      ? (error.config as RetryConfig | undefined)
      : undefined;

    const apiError = normalizeAxiosError(error);

    if (original && !isCurrentSession(original)) {
      throw apiError;
    }

    if (
      original &&
      apiError.status === 401 &&
      !original._retry &&
      canRefresh(original.url) &&
      !getPendingSessionTransition()
    ) {
      original._retry = true;

      // При ошибке общего refresh все ожидающие запросы отклоняются без повтора.
      await refreshSession(original);

      if (!isCurrentSession(original)) {
        throw apiError;
      }

      return apiClient(original);
    }

    if (apiError.status === 401 && original?._retry) {
      expireSession(original.sessionVersion ?? getSessionVersion(), shouldNotifyErrors(original));
    }

    if (shouldNotifyErrors(original) && isTechnicalError(apiError)) {
      notifyGlobal(apiError.message);
    }

    throw apiError;
  },
);
