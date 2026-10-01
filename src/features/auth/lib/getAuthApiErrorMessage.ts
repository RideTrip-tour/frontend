import { handleApiError } from '@/shared/api/errors';

import { getAuthErrorMessage } from '../model/authErrorCodes';

export function getAuthApiErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);

  if (typeof apiError.data === 'object' && apiError.data !== null) {
    const data = apiError.data as {
      detail?: unknown;
      message?: unknown;
      error?: unknown;
    };

    const detail = data.detail ?? data.message ?? data.error;

    const authMessage = getAuthErrorMessage(detail);

    if (authMessage) {
      return authMessage;
    }
  }

  return apiError.message;
}
