export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  LOGIN_BAD_CREDENTIALS: 'Неправильный логин или пароль',
  REGISTER_USER_ALREADY_EXISTS: 'Пользователь уже зарегистрирован',
  RESET_PASSWORD_BAD_TOKEN: 'Ошибка сброса пароля',
  VERIFY_USER_BAD_TOKEN: 'Неверный токен верификации',
  UPDATE_USER_INVALID_PASSWORD: 'Неправильно задан пароль',
  UPDATE_USER_EMAIL_ALREADY_EXISTS: 'Email уже зарегистрирован'
};

export function getErrorMessage(detail: unknown): string | null {
  if (!detail) return null;

  if (typeof detail === 'string') {
    return AUTH_ERROR_MESSAGES[detail] ?? null;
  }

  if (typeof detail === 'object' && detail !== null) {
    const code = (detail as Record<string, unknown>).code;
    if (typeof code === 'string') {
      return AUTH_ERROR_MESSAGES[code] ?? null;
    }
  }

  return null;
}
