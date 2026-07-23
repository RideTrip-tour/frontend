import axios from "axios";
import { useAuthStore } from "@/store";
import { getApiBaseUrl } from "@/api/baseUrl";

const baseURL = getApiBaseUrl();

export const http = axios.create({
  baseURL,
  withCredentials: true
});

// --- очередь refresh, чтобы не было 10 refresh параллельно
let isRefreshing = false;
let pending: Array<() => void> = [];

function resolvePending() {
  pending.forEach((cb) => cb());
  pending = [];
}

// RESPONSE interceptor: 401 → refresh → retry
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
      return new Promise<boolean>((resolve) => {
        pending.push(() => resolve(http(original)));
      });
    }

    isRefreshing = true;

    try {
      await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
      resolvePending();
      return http(original);
    } catch (e) {
      useAuthStore.getState().logout();
      resolvePending();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
