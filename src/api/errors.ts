import type { AxiosError } from "axios";

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  url?: string;

  constructor(
    message: string,
    opts?: { status?: number; data?: unknown; url?: string }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.data = opts?.data;
    this.url = opts?.url;
  }
}

export function normalizeAxiosError(err: unknown): ApiError {
  const e = err as AxiosError<any>;

  const status = e?.response?.status;
  const data = e?.response?.data;
  const url = e?.config?.url;

  const message =
    data?.message || data?.error || e?.message || "Request failed";

  return new ApiError(String(message), { status, data, url });
}
