import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/api/client";
import { handleApiError } from "@/api/errors";

import { meRequest } from './usersService';
import type { CurrentUser } from './usersService';

export type VerifiedUser = CurrentUser & { is_verified: true };

export async function loginRequest(email: string, password: string) {
  try {
    await apiClient.post(
      "/auth/login",
      { grant_type: 'password', username: email, password },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const user = await meRequest();
    useAuthStore.getState().setUser(user);
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function registerRequest(data: { email: string; password: string }) {
  try {
    await apiClient.post("/auth/register", data);
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function forgotPasswordRequest(email: string) {
  try {
    await apiClient.post("/auth/forgot-password", { email });
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function resendForgotPasswordEmail(email: string) {
  await forgotPasswordRequest(email);
}

export async function resetPasswordRequest(data: { token: string; password: string }) {
  try {
    await apiClient.post("/auth/reset-password", data);
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function verifyRequest(token: string): Promise<VerifiedUser> {
  try {
    const res = await apiClient.post<VerifiedUser>("/auth/verify", { token });
    if (res.data?.is_verified !== true) {
      throw new Error('Подтверждение почты не получено');
    }
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export function getVerificationError(error: unknown) {
  const { status } = handleApiError(error);

  if (status === 400) {
    return {
      message: 'Ссылка недействительна, срок её действия истёк или почта уже подтверждена.',
      canRetry: false,
    };
  }

  if (status === 422) {
    return {
      message: 'Ссылка подтверждения некорректна. Откройте полную ссылку из письма.',
      canRetry: false,
    };
  }

  return {
    message: 'Не удалось подтвердить почту. Попробуйте ещё раз позже.',
    canRetry: !status || status >= 500,
  };
}

export async function logoutRequest() {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    useAuthStore.getState().logout();
  }
}
