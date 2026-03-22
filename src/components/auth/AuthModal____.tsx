import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import styles from './AuthModal.module.scss';

type AuthModalProps = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({
  isLoading = false,
  serverError = '',
  onClose,
  onSubmit,
  onForgotPassword,
  onRegisterClick
}: AuthModalProps) {
  const [email, setEmail] = useState('travel.designer@mail.ru');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEmailFilled = email.trim().length > 0;
  const isPasswordFilled = password.trim().length > 0;

  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.trim().length >= 8;

  const hasServerError = Boolean(serverError);

  const emailStatus: FieldStatus = useMemo(() => {
    if (hasServerError) return 'error';
    if (emailFocused) return 'focus';
    if (isEmailFilled && isEmailValid) return 'success';
    return 'default';
  }, [emailFocused, isEmailFilled, isEmailValid, hasServerError]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (hasServerError) return 'error';
    if (passwordFocused) return 'focus';
    if (isPasswordFilled && isPasswordValid) return 'success';
    return 'default';
  }, [passwordFocused, isPasswordFilled, isPasswordValid, hasServerError]);

  const isSubmitEnabled = isEmailValid && isPasswordValid && !isLoading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    await onSubmit?.({ email: email.trim(), password: password.trim() });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className={styles.title}>Добро пожаловать!</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>

            <div className={`${styles.inputWrapper} ${styles[emailStatus]}`}>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              Пароль
            </label>

            <div className={`${styles.inputWrapper} ${styles[passwordStatus]}`}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="current-password"
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

            <button type="button" className={styles.linkButton} onClick={onForgotPassword}>
              Забыли пароль?
            </button>
          </div>

          <div className={styles.errorBlock}>
            {hasServerError ? serverError : <span className={styles.errorPlaceholder}>.</span>}
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
            disabled={!isSubmitEnabled}
          >
            {isLoading ? <span className={styles.loader} /> : 'Войти'}
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>Или</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.footerText}>
            Нет аккаунта?{' '}
            <button type="button" className={styles.registerButton} onClick={onRegisterClick}>
              Зарегистрироваться
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
