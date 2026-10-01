import { useAuthStore } from '@/store/authStore';
import { authApi, authRequestOptions } from '@/shared/api/auth/authApi';
import { handleApiError } from '@/shared/api/errors';
import type { UserCreate, ResetPass, UserBeforeVerify } from '@/shared/api/generated/auth/auth';
import { meRequest } from './usersService';

export type VerifiedUser = UserBeforeVerify & {
  is_verified: true;
};

export async function loginRequest(email: string, password: string) {
  try {
    await authApi.authCookieLoginApiAuthLoginPost(
      {
        grant_type: 'password',
        username: email,
        password,
      },
      authRequestOptions,
    );

    const user = await meRequest();
    useAuthStore.getState().setUser(user);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function registerRequest(data: Pick<UserCreate, 'email' | 'password'>) {
  try {
    await authApi.registerRegisterApiAuthRegisterPost(data, authRequestOptions);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function forgotPasswordRequest(email: string) {
  try {
    await authApi.resetForgotPasswordApiAuthForgotPasswordPost({ email }, authRequestOptions);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function resendForgotPasswordEmail(email: string) {
  await forgotPasswordRequest(email);
}

export async function resetPasswordRequest(data: ResetPass) {
  try {
    await authApi.resetResetPasswordApiAuthResetPasswordPost(data, authRequestOptions);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function verifyRequest(token: string): Promise<VerifiedUser> {
  try {
    const response = await authApi.verifyVerifyApiAuthVerifyPost({ token }, authRequestOptions);

    if (response.data?.is_verified !== true) {
      throw new Error('Подтверждение почты не получено');
    }

    return { ...response.data, is_verified: true };
  } catch (error) {
    throw handleApiError(error);
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
    await authApi.authCookieLogoutApiAuthLogoutPost(authRequestOptions);
  } finally {
    useAuthStore.getState().logout();
  }
}
