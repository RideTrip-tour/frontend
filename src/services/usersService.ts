import { authApi, authRequestOptions } from '@/shared/api/auth/authApi';
import { handleApiError } from '@/shared/api/errors';
import type {
  UserRead,
  UserUpdatePassword,
  UserUpdateEmail,
} from '@/shared/api/generated/auth/auth';

export type CurrentUser = UserRead;

export async function meRequest(): Promise<CurrentUser> {
  try {
    const response = await authApi.usersCurrentUserApiUsersMeGet(authRequestOptions);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function changePasswordRequest(data: UserUpdatePassword) {
  try {
    const response = await authApi.usersPatchPassCurrentUserApiUsersMeChangePasswordPost(
      data,
      authRequestOptions,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function requestChangeEmailRequest(data: UserUpdateEmail) {
  try {
    const response = await authApi.usersPatchEmailCurrentUserApiUsersMeRequestChangeEmailPost(
      data,
      authRequestOptions,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
