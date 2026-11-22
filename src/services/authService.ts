import { authApi, authRequestOptions } from '@/shared/api/auth/authApi';
import { ApiError, handleApiError } from '@/shared/api/errors';
import type { UserCreate, ResetPass, UserBeforeVerify } from '@/shared/api/generated/auth/auth';
import {
  beginSessionTransition,
  finishSessionTransition,
  getSessionVersion,
} from '@/shared/api/sessionEvents';
import { useAuthStore } from '@/store/authStore';

import { meRequest } from './usersService';

export type VerifiedUser = UserBeforeVerify & {
  is_verified: true;
};

export async function loginRequest(email: string, password: string) {
  const sessionVersion = beginSessionTransition();
  const requestOptions = { ...authRequestOptions, sessionVersion };

  try {
    await authApi.authCookieLoginApiAuthLoginPost(
      {
        grant_type: 'password',
        username: email,
        password,
      },
      requestOptions,
    );

    if (sessionVersion !== getSessionVersion()) {
      throw new ApiError('Сессия изменилась. Повторите вход.');
    }

    const user = await meRequest({ sessionVersion });

    if (sessionVersion !== getSessionVersion()) {
      throw new ApiError('Сессия изменилась. Повторите вход.');
    }

    useAuthStore.getState().setUser(user);
  } catch (error) {
    throw handleApiError(error);
  } finally {
    finishSessionTransition(sessionVersion);
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
  const requestOptions = { ...authRequestOptions, authContext: 'form' as const };

  try {
    await authApi.resetResetPasswordApiAuthResetPasswordPost(data, requestOptions);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function verifyRequest(token: string): Promise<VerifiedUser> {
  try {
    const response = await authApi.verifyVerifyApiAuthVerifyPost({ token }, authRequestOptions);

    return { ...response.data, is_verified: true };
  } catch (error) {
    throw handleApiError(error);
  }
}

export function isAlreadyVerifiedError(error: unknown): boolean {
  const apiError = handleApiError(error);

  if (apiError.status !== 400) {
    return false;
  }

  const data = apiError.data;
  const detail =
    typeof data === 'object' && data !== null && 'detail' in data
      ? (data as { detail?: unknown }).detail
      : undefined;

  return (
    detail === 'VERIFY_USER_ALREADY_VERIFIED' || apiError.message === 'VERIFY_USER_ALREADY_VERIFIED'
  );
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
  const sessionVersion = beginSessionTransition();
  const requestOptions = { ...authRequestOptions, sessionVersion };

  try {
    await authApi.authCookieLogoutApiAuthLogoutPost(requestOptions);
    if (sessionVersion !== getSessionVersion()) {
      throw new ApiError('Сессия изменилась во время выхода.');
    }
  } catch (error) {
    throw handleApiError(error);
  } finally {
    if (sessionVersion === getSessionVersion()) {
      useAuthStore.getState().logout();
    }

    finishSessionTransition(sessionVersion);
  }
}
