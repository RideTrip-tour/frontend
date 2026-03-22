import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthShell } from './index';
import styles from './RegisterModal.module.scss';

type RegisterModalProps = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onLoginClick?: () => void;
  onTermsClick?: () => void;
  onSubmit?: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';
type ErrorType = 'email-exists' | 'password-invalid' | 'password-mismatch' | '';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function RegisterModal({
  isLoading = false,
  serverError = '',
  onClose,
  onLoginClick,
  onTermsClick,
  onSubmit
}: RegisterModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const emailValid = emailRegex.test(email.trim());
  const passwordValid = passwordRegex.test(password.trim());
  const confirmFilled = confirmPassword.trim().length > 0;
  const passwordsMatch =
    password.trim().length > 0 && confirmPassword.trim().length > 0 && password === confirmPassword;

  const errorType: ErrorType = useMemo(() => {
    if (serverError === 'Такой пользователь уже существует') return 'email-exists';
    if (serverError === 'Минимум 8 символов, буквы и цифры') return 'password-invalid';
    if (serverError === 'Пароли не совпадают') return 'password-mismatch';
    return '';
  }, [serverError]);

  const emailStatus: FieldStatus = useMemo(() => {
    if (errorType === 'email-exists') return 'error';
    if (emailFocused) return 'focus';
    if (emailValid) return 'success';
    return 'default';
  }, [errorType, emailFocused, emailValid]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (errorType === 'password-invalid' || errorType === 'password-mismatch') return 'error';
    if (passwordFocused) return 'focus';
    if (passwordValid) return 'success';
    return 'default';
  }, [errorType, passwordFocused, passwordValid]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (errorType === 'password-mismatch') return 'error';
    if (confirmFocused) return 'focus';
    if (confirmFilled && passwordsMatch) return 'success';
    return 'default';
  }, [errorType, confirmFocused, confirmFilled, passwordsMatch]);

  const showPasswordsMatch = !serverError && passwordValid && confirmFilled && passwordsMatch;
  const isSubmitEnabled =
    emailValid && passwordValid && passwordsMatch && acceptedTerms && !isLoading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    await onSubmit?.({
      email: email.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
      acceptedTerms
    });
  };

  return (
    <AuthShell title="Регистрация" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGroup}>
          {errorType === 'email-exists' ? (
            <p className={styles.topError}>Такой пользователь уже существует</p>
          ) : (
            <label className={styles.label} htmlFor="register-email">
              Email
            </label>
          )}

          <div className={`${styles.inputWrapper} ${styles[emailStatus]}`}>
            <input
              id="register-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label
            className={`${styles.label} ${
              errorType === 'password-invalid' || errorType === 'password-mismatch'
                ? styles.labelError
                : showPasswordsMatch
                  ? styles.labelSuccess
                  : ''
            }`}
            htmlFor="register-password"
          >
            Пароль
          </label>

          <div className={`${styles.inputWrapper} ${styles[passwordStatus]}`}>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              autoComplete="new-password"
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

          <p
            className={`${styles.hint} ${
              errorType === 'password-invalid'
                ? styles.hintError
                : showPasswordsMatch
                  ? styles.hintSuccess
                  : ''
            }`}
          >
            Минимум 8 символов, буквы и цифры
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label
            className={`${styles.label} ${
              errorType === 'password-mismatch'
                ? styles.labelError
                : showPasswordsMatch
                  ? styles.labelSuccess
                  : ''
            }`}
            htmlFor="register-confirm-password"
          >
            Повторите пароль
          </label>

          <div className={`${styles.inputWrapper} ${styles[confirmStatus]}`}>
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              autoComplete="new-password"
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

        <div className={styles.statusBlock}>
          {errorType === 'password-mismatch' ? (
            <p className={styles.centerError}>Пароли не совпадают</p>
          ) : showPasswordsMatch ? (
            <p className={styles.centerSuccess}>Пароли совпадают</p>
          ) : (
            <span className={styles.placeholder}>.</span>
          )}
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxBox}>{acceptedTerms ? '✓' : ''}</span>
          <span className={styles.checkboxText}>
            Я соглашаюсь с{' '}
            <button type="button" className={styles.linkButtonInline} onClick={onTermsClick}>
              Условиями использования
            </button>
          </span>
        </label>

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled}
        >
          {isLoading ? <span className={styles.loader} /> : 'Создать аккаунт'}
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>Или</span>
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.footerText}>
          Уже есть аккаунт?{' '}
          <button type="button" className={styles.footerLink} onClick={onLoginClick}>
            Войти
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
