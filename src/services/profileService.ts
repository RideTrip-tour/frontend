import { http } from "./http";
import { apiClient } from "@/api/client";
import { handleApiError } from "@/api/errors";

export type ProfileData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  age: number;
  about_me: string;
  activities: string[];
  country: string;
  city: string;
  citizenship: string;
  currency: string;
};

export type Profile = ProfileData & {
  id: number;
  user_id: number;
  role: string;
  created_at: string;
  updated_at: string;
};

export async function healthCheck() {
  try {
    const res = await http.get<string>("/profile/health");
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function createProfileRequest(data: ProfileData) {
  try {
    const res = await apiClient.post<Profile>("/profile/", data);
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function getMyProfileRequest() {
  try {
    const res = await apiClient.get<Profile>("/profile/me");
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function updateMyProfileRequest(data: ProfileData) {
  try {
    const res = await apiClient.patch<Profile>("/profile/me", data);
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function deleteMyProfileRequest() {
  try {
    await apiClient.delete("/profile/me");
  } catch (e) {
    throw handleApiError(e);
  }
}

export async function getProfileByIdRequest(userId: number) {
  try {
    const res = await apiClient.get<Profile>(`/profile/${userId}`);
    return res.data;
  } catch (e) {
    throw handleApiError(e);
  }
}