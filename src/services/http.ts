import axios from "axios";
import { useAuthStore } from "@/store";

const API_URL = import.meta.env.VITE_API_URL as string;

export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

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

    if (isRefreshing) {
      return new Promise<boolean>((resolve) => {
        pending.push(() => resolve(http(original)));
      });
    }

    isRefreshing = true;

    try {
      await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
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
