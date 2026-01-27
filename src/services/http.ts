import axios from "axios";
import { useAuthStore } from "@/store";

const API_URL = import.meta.env.VITE_API_URL as string;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true // важно, если refresh-token в httpOnly cookie
});

// --- очередь refresh, чтобы не было 10 refresh параллельно
let isRefreshing = false;
let pending: Array<(token: string | null) => void> = [];

function resolvePending(token: string | null) {
  pending.forEach((cb) => cb(token));
  pending = [];
}

// REQUEST interceptor: подставить JWT
http.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE interceptor: ловим 401 → refresh → retry
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as any;
    const status = error?.response?.status;

    if (status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // Если refresh уже идёт — ждём его
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pending.push((newToken) => {
          if (!newToken) return reject(error);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken: string | undefined = refreshRes.data?.token;
      if (!newToken) {
        useAuthStore.getState().logout();
        resolvePending(null);
        return Promise.reject(error);
      }

      const prevUser = useAuthStore.getState().user;
      useAuthStore.getState().login({
        token: newToken,
        user: refreshRes.data?.user ?? (prevUser as any)
      });

      resolvePending(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return http(original);
    } catch (e) {
      useAuthStore.getState().logout();
      resolvePending(null);
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
