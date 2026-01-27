import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import { useAuthStore } from "@/store";
import { ApiError, normalizeAxiosError } from "./errors";

type RefreshResponse = {
  token: string;
  user?: { id: string; email: string; name: string };
};
//я предполагаю что что эндпоит будет  POST /auth/refresh => { token, user? }
// очередь refresh, чтобы параллельные 401 не делали много refresh-запросов
let isRefreshing = false;
let waiters: Array<(token: string | null) => void> = [];

function resolveWaiters(token: string | null) {
  waiters.forEach((cb) => cb(token));
  waiters = [];
}

export function setupInterceptors(client: AxiosInstance) {
  // отдельный клиент без интерсепторов — чтобы refresh не зациклился
  const plain = axios.create({
    baseURL: client.defaults.baseURL,
    withCredentials: client.defaults.withCredentials,
    timeout: client.defaults.timeout,
    headers: client.defaults.headers
  });

  // ===== Request interceptor: Authorization =====
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ===== Response interceptor: 401 -> refresh -> retry =====
  client.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err: unknown) => {
      const axiosErr = err as any;
      const status: number | undefined = axiosErr?.response?.status;
      const original = axiosErr?.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      // единая обработка не-axios ошибок
      if (!original) {
        throw normalizeAxiosError(err);
      }

      const url = String(original.url || "");

      // Не пытаемся рефрешить:
      // - если не 401
      // - если это уже повтор (защита от бесконечного цикла)
      // - если это сам refresh endpoint
      if (status !== 401 || original._retry || url.includes("/auth/refresh")) {
        throw normalizeAxiosError(err);
      }

      original._retry = true;

      // если refresh уже идёт — ждём
      if (isRefreshing) {
        const token = await new Promise<string | null>((resolve) => {
          waiters.push(resolve);
        });

        if (!token) {
          useAuthStore.getState().logout();
          throw new ApiError("Unauthorized", { status: 401, url });
        }

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return client(original);
      }

      // запускаем refresh
      isRefreshing = true;
      try {
        const refreshRes = await plain.post<RefreshResponse>(
          "/auth/refresh",
          {}
        );
        const newToken = refreshRes.data?.token;

        if (!newToken) {
          resolveWaiters(null);
          useAuthStore.getState().logout();
          throw new ApiError("Refresh failed", {
            status: 401,
            url: "/auth/refresh"
          });
        }

        const prevUser = useAuthStore.getState().user;
        useAuthStore.getState().login({
          token: newToken,
          user: refreshRes.data.user ?? (prevUser as any)
        });

        resolveWaiters(newToken);

        // повторяем исходный запрос с новым токеном
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch (e) {
        resolveWaiters(null);
        useAuthStore.getState().logout();
        throw normalizeAxiosError(e);
      } finally {
        isRefreshing = false;
      }
    }
  );

  // ===== “Error interceptor”: единая нормализация ошибок =====
  // В axios это уже делается в response error handler через normalizeAxiosError,
  // но можно ещё добавить helper для ручного использования.
}

export function handleApiError(err: unknown): ApiError {
  const apiError = err instanceof ApiError ? err : normalizeAxiosError(err);

  // Здесь можно централизованно логировать:
  // console.error(`[API] ${apiError.status} ${apiError.url}: ${apiError.message}`, apiError.data)

  return apiError;
}
