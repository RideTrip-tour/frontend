import { handleApiError } from '@/shared/api/errors';

import { getAuthErrorMessage } from '../model/authErrorCodes';

export function getPasswordResetErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  const data = apiError.data;
  const detail =
    typeof data === 'object' && data !== null && 'detail' in data ? data.detail : undefined;
  const message = getAuthErrorMessage(detail);

  if (message) return message;

  if (apiError.status === 422) {
    return 'Не удалось обновить пароль. Проверьте требования к паролю или запросите новую ссылку.';
  }

  if (apiError.code === 'NETWORK' || apiError.code === 'TIMEOUT') {
    return 'Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.';
  }

  return 'Не удалось обновить пароль. Попробуйте ещё раз позже или запросите новую ссылку.';
}
