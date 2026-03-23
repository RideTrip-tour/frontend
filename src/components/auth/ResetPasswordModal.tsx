import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthField, AuthShell } from './index';
import styles from './AuthForm.module.scss';

type ResetPasswordModalProps = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onSubmit?: (data: { password: string; confirmPassword: string }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const passwordHint = 'Минимум 8 символов, буквы и цифры';

export default function ResetPasswordModal({
  isLoading = false,
  serverError = '',
  onClose,
  onSubmit
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const passwordValid = password.trim().length >= 8;
  const confirmFilled = confirmPassword.trim().length > 0;
  const confirmValid = confirmPassword.trim().length >= 8;
  const passwordsMatch =
    password.trim().length > 0 && confirmPassword.trim().length > 0 && password === confirmPassword;

  const hasMismatchError = Boolean(serverError);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (hasMismatchError) return 'error';
    if (passwordFocused) return 'focus';
    if (passwordValid) return 'success';
    return 'default';
  }, [hasMismatchError, passwordFocused, passwordValid]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (hasMismatchError) return 'error';
    if (confirmFocused) return 'focus';
    if (confirmFilled && passwordsMatch) return 'success';
    return 'default';
  }, [hasMismatchError, confirmFocused, confirmFilled, passwordsMatch]);

  const isSubmitEnabled = passwordValid && confirmValid && passwordsMatch && !isLoading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    await onSubmit?.({
      password: password.trim(),
      confirmPassword: confirmPassword.trim()
    });
  };

  return (
    <AuthShell title="Восстановление пароля" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          id="reset-password"
          type="password"
          label="Новый пароль"
          value={password}
          status={passwordStatus}
          hint={passwordHint}
          hintTone={hasMismatchError ? 'error' : 'default'}
          labelTone={hasMismatchError ? 'error' : 'default'}
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />

        <AuthField
          id="reset-confirm-password"
          type="password"
          label="Повторите пароль"
          value={confirmPassword}
          status={confirmStatus}
          hint={passwordHint}
          hintTone={hasMismatchError ? 'error' : 'default'}
          labelTone={hasMismatchError ? 'error' : 'default'}
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          onChange={setConfirmPassword}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
        />

        <div className={styles.statusBlock}>
          {hasMismatchError ? (
            <p className={styles.centerError}>{serverError}</p>
          ) : (
            <span className={styles.placeholder}>.</span>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled}
        >
          {isLoading ? <span className={styles.loader} /> : 'Обновить пароль'}
        </button>
      </form>
    </AuthShell>
  );
}
