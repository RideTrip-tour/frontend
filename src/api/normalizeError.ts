import type { AxiosError } from 'axios';
import { ApiError, type ApiErrorCode } from './ApiError';

function codeFromStatus(status?: number): ApiErrorCode {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION';
  if (status && status >= 500) return 'SERVER';
  return 'UNKNOWN';
}

export function normalizeAxiosError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  const e = err as AxiosError<any>;

  // timeout
  if ((e as any)?.code === 'ECONNABORTED') {
    return new ApiError('Request timeout. Please try again.', {
      code: 'TIMEOUT',
      details: { originalMessage: e?.message }
    });
  }

  // network
  if (e?.message === 'Network Error' || !e?.response) {
    return new ApiError('Network error. Check your connection.', {
      code: 'NETWORK',
      details: { originalMessage: e?.message }
    });
  }

  const status = e.response.status;
  const data = e.response.data;

  const message = data?.message || data?.error || e.message || 'Request failed';

  return new ApiError(String(message), {
    code: codeFromStatus(status),
    status,
    details: data
  });
}
