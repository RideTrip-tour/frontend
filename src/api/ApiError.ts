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
  code: ApiErrorCode;
  details?: unknown;

  constructor(message: string, opts: { code: ApiErrorCode; status?: number; details?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}
