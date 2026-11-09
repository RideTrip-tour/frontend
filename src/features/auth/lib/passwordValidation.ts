export const PASSWORD_HINT = 'Минимум 8 символов, буквы и цифры';

export function isValidPassword(password: string): boolean {
  // Печатные ASCII-символы от ! до ~: латиница, цифры и спецсимволы.
  return password.length >= 8 && password.length <= 100 && !/[^!-~]/.test(password);
}
