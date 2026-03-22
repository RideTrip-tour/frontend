import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import styles from './ForgotPasswordModal.module.scss';

type ForgotPasswordModalProps = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onBackToLogin?: () => void;
  onRegisterClick?: () => void;
  onSubmit?: (email: string) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordModal({
  isLoading = false,
  serverError = '',
  onClose,
  onBackToLogin,
  onRegisterClick,
  onSubmit
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isFilled = email.trim().length > 0;
  const isValid = emailRegex.test(email.trim());
  const hasServerError = Boolean(serverError);

  const fieldStatus: FieldStatus = useMemo(() => {
    if (hasServerError) return 'error';
    if (isFocused) return 'focus';
    if (isFilled && isValid) return 'success';
    return 'default';
  }, [hasServerError, isFocused, isFilled, isValid]);

  const isSubmitEnabled = isValid && !isLoading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;
    await onSubmit?.(email.trim());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className={styles.title}>Сбросить пароль</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            {hasServerError ? (
              <p className={styles.topError}>{serverError}</p>
            ) : (
              <label className={styles.label} htmlFor="forgot-email">
                Email
              </label>
            )}

            <div className={`${styles.inputWrapper} ${styles[fieldStatus]}`}>
              <input
                id="forgot-email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="email"
              />
            </div>
          </div>

          <p className={styles.description}>
            Мы отправим ссылку для создания
            <br />
            нового пароля.
          </p>

          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
            disabled={!isSubmitEnabled}
          >
            {isLoading ? <span className={styles.loader} /> : 'Сбросить пароль'}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>Или</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.footerText}>
            {hasServerError ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={hasServerError ? onRegisterClick : onBackToLogin}
            >
              {hasServerError ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
