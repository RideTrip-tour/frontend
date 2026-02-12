import type { AxiosError } from 'axios';

export type ApiErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  url?: string;
  code: ApiErrorCode;

  constructor(
    message: string,
    opts?: {
      status?: number;
      data?: unknown;
      url?: string;
      code?: ApiErrorCode;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = opts?.status;
    this.data = opts?.data;
    this.url = opts?.url;
    this.code = opts?.code ?? 'UNKNOWN';
  }
}

function mapStatusToCode(status?: number): ApiErrorCode {
  if (!status) return 'UNKNOWN';
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION';
  if (status >= 500) return 'SERVER';
  return 'UNKNOWN';
}

export function normalizeAxiosError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  const e = err as AxiosError<any>;

  // network
  if (e?.message === 'Network Error' || !e?.response) {
    return new ApiError('Network error', {
      code: 'NETWORK',
      url: e?.config?.url
    });
  }

  // timeout
  if ((e as any)?.code === 'ECONNABORTED') {
    return new ApiError('Request timeout', {
      code: 'TIMEOUT',
      url: e?.config?.url
    });
  }

  const status = e?.response?.status;
  const data = e?.response?.data;
  const url = e?.config?.url;

  const message = data?.message || data?.error || e?.message || 'Request failed';

  return new ApiError(String(message), {
    status,
    data,
    url,
    code: mapStatusToCode(status)
  });
}
