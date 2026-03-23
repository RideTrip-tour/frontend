import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthCheckbox, AuthDivider, AuthField, AuthShell } from './index';
import styles from './AuthForm.module.scss';

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
const passwordHint = 'Минимум 8 символов, буквы и цифры';

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
  const confirmValid = confirmPassword.trim().length >= 8;
  const passwordsMatch =
    password.trim().length > 0 && confirmPassword.trim().length > 0 && password === confirmPassword;

  const errorType: ErrorType = useMemo(() => {
    if (serverError === 'Такой пользователь уже существует') return 'email-exists';
    if (serverError === 'Минимум 8 символов, буквы и цифры') return 'password-invalid';
    if (serverError === 'Пароли не совпадают' || serverError === 'Введенные пароли не совпадают') {
      return 'password-mismatch';
    }
    return '';
  }, [serverError]);

  const emailStatus: FieldStatus = useMemo(() => {
    if (errorType === 'email-exists') return 'error';
    if (emailFocused) return 'focus';
    if (emailValid) return 'success';
    return 'default';
  }, [errorType, emailFocused, emailValid]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (errorType === 'password-invalid' || errorType === 'password-mismatch') {
      return 'error';
    }
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

  const showPasswordsMatch = !serverError && passwordValid && confirmValid && passwordsMatch;

  const isSubmitEnabled =
    emailValid && passwordValid && confirmValid && passwordsMatch && acceptedTerms && !isLoading;

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
        <AuthField
          id="register-email"
          type="email"
          label="Email"
          value={email}
          status={emailStatus}
          topError={errorType === 'email-exists' ? 'Такой пользователь уже существует' : undefined}
          autoComplete="email"
          onChange={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />

        <AuthField
          id="register-password"
          type="password"
          label="Пароль"
          value={password}
          status={passwordStatus}
          hint={passwordHint}
          hintTone={
            errorType === 'password-invalid' ? 'error' : showPasswordsMatch ? 'success' : 'default'
          }
          labelTone={
            errorType === 'password-invalid' || errorType === 'password-mismatch'
              ? 'error'
              : showPasswordsMatch
                ? 'success'
                : 'default'
          }
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />

        <AuthField
          id="register-confirm-password"
          type="password"
          label="Повторите пароль"
          value={confirmPassword}
          status={confirmStatus}
          hint={passwordHint}
          hintTone={
            errorType === 'password-mismatch' ? 'error' : showPasswordsMatch ? 'success' : 'default'
          }
          labelTone={
            errorType === 'password-mismatch' ? 'error' : showPasswordsMatch ? 'success' : 'default'
          }
          autoComplete="new-password"
          showToggle
          isPasswordVisible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          onChange={setConfirmPassword}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
        />

        <div className={styles.statusBlock}>
          {errorType === 'password-mismatch' ? (
            <p className={styles.centerError}>Пароли не совпадают</p>
          ) : showPasswordsMatch ? (
            <p className={styles.centerSuccess}>Пароли совпадают</p>
          ) : (
            <span className={styles.placeholder}>.</span>
          )}
        </div>

        <AuthCheckbox checked={acceptedTerms} onChange={setAcceptedTerms}>
          <span>
            Я соглашаюсь с{' '}
            <button type="button" className={styles.linkButtonInline} onClick={onTermsClick}>
              Условиями использования
            </button>
          </span>
        </AuthCheckbox>

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled}
        >
          {isLoading ? <span className={styles.loader} /> : 'Создать аккаунт'}
        </button>

        <AuthDivider />

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
