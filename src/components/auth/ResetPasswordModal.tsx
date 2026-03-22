import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import styles from './ResetPasswordModal.module.scss';

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
  onSubmit
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const passwordValid = password.trim().length >= 8;
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
    if (confirmValid && passwordsMatch) return 'success';
    return 'default';
  }, [hasMismatchError, confirmFocused, confirmValid, passwordsMatch]);

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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className={styles.title}>Восстановление пароля</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="new-password">
              Новый пароль
            </label>

            <div className={`${styles.inputWrapper} ${styles[passwordStatus]}`}>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="new-password"
                placeholder=""
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? '◉' : '◌'}
              </button>
            </div>

            <p className={styles.hint}>Минимум 8 символов, буквы и цифры</p>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirm-password">
              Повторите пароль
            </label>

            <div className={`${styles.inputWrapper} ${styles[confirmStatus]}`}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                autoComplete="new-password"
                placeholder=""
              />

              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showConfirmPassword ? '◉' : '◌'}
              </button>
            </div>

            <p className={styles.hint}>Минимум 8 символов, буквы и цифры</p>
          </div>

          <div className={styles.errorBlock}>
            {hasMismatchError ? serverError : <span className={styles.errorPlaceholder}>.</span>}
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
            disabled={!isSubmitEnabled}
          >
            {isLoading ? <span className={styles.loader} /> : 'Обновить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
}
