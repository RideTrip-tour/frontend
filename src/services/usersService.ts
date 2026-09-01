import { apiClient } from "@/api/client";
import { handleApiError } from "@/api/errors";

export type CurrentUser = {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
};

export async function meRequest() {
  try {
    const res = await apiClient.get<CurrentUser>("/users/me");
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function changePasswordRequest(data: { current_password: string; new_password: string }) {
  try {
    const res = await apiClient.post<{ status: string }>("/users/me/change-password", data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function requestChangeEmailRequest(data: { current_email: string; new_email: string; password: string }) {
  try {
    const res = await apiClient.post<{ status: string }>("/users/me/request-change-email", data);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
}