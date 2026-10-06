import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { isValidPassword, PASSWORD_HINT } from '@/features/auth/lib/passwordValidation';

import { AuthField, AuthShell } from './index';

import styles from './AuthForm.module.scss';

type ResetPasswordModalProps = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onSubmit?: (data: { password: string; confirmPassword: string }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

export default function ResetPasswordModal({
  isLoading = false,
  serverError = '',
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const passwordValid = isValidPassword(password);
  const confirmValid = isValidPassword(confirmPassword);
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // флаг ошибки несоответствия паролей
  const hasMismatchError = !passwordsMatch && confirmPassword.length > 0;

  const passwordStatus: FieldStatus = useMemo(() => {
    if (hasMismatchError || serverError) return 'error';
    if (passwordFocused) return 'focus';
    if (!password) return 'default';
    return passwordValid ? 'success' : 'error';
  }, [hasMismatchError, serverError, passwordFocused, passwordValid, password]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (hasMismatchError || serverError) return 'error';
    if (confirmFocused) return 'focus';
    if (confirmValid && passwordsMatch) return 'success';
    return 'default';
  }, [hasMismatchError, serverError, confirmFocused, confirmValid, passwordsMatch]);

  const isSubmitEnabled = passwordValid && confirmValid && passwordsMatch && !isLoading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    await onSubmit?.({
      password,
      confirmPassword,
    });
  };

  return (
    <AuthShell
      title="Восстановление пароля"
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <AuthField
          id="reset-password"
          type="password"
          label="Новый пароль"
          value={password}
          status={passwordStatus}
          hint={PASSWORD_HINT}
          hintTone={passwordStatus === 'error' ? 'error' : 'default'}
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isLast={false}
        />

        <AuthField
          id="reset-confirm-password"
          type="password"
          label="Повторите пароль"
          value={confirmPassword}
          status={confirmStatus}
          hint={PASSWORD_HINT}
          hintTone={confirmStatus === 'error' ? 'error' : 'default'}
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          onChange={setConfirmPassword}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
          isLast={true}
        />

        {hasMismatchError && <p className={styles.centerError}>Введенные пароли не совпадают</p>}

        <button
          type="submit"
          className={`${styles.submitButton} ${styles.updatePassword} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled}
        >
          {isLoading ? <span className={styles.loader} /> : 'Обновить пароль'}
        </button>
      </form>
    </AuthShell>
  );
}
