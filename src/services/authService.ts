import { http } from "./http";
import { useAuthStore } from "@/store";
import { apiClient } from "@/api/client";
import { handleApiError } from "@/api/interceptors";

type User = { id: string; email: string; name: string };

export async function loginRequest(email: string, password: string) {
  try {
    const res = await apiClient.post<{ token: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    useAuthStore.getState().login(res.data);
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function meRequest() {
  const res = await http.get<User>("/auth/me");
  return res.data;
}

export async function logoutRequest() {
  try {
    await http.post("/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
}

export async function verifyEmailRequest(token: string) {
  try {
    const res = await apiClient.post<User>("/auth/verify", {
      token,
    });

    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}