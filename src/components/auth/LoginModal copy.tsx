import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthDivider, AuthShell } from './index';
import AuthField from './AuthField';
import styles from './AuthForm.module.scss';

type Props = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal({
  isLoading = false,
  serverError = '',
  onClose,
  onSubmit,
  onForgotPassword,
  onRegisterClick
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length >= 8;

  const emailStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (emailFocused) return 'focus';
    if (email && isEmailValid) return 'success';
    return 'default';
  }, [emailFocused, isEmailValid, serverError, email]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (passwordFocused) return 'focus';
    if (password && isPasswordValid) return 'success';
    return 'default';
  }, [passwordFocused, isPasswordValid, serverError, password]);

  const isSubmitEnabled = isEmailValid && isPasswordValid && !isLoading;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;
    await onSubmit?.({ email, password });
  };

  return (
    <AuthShell title="Добро пожаловать!" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          value={email}
          status={emailStatus}
          // hint={
          //   emailStatus === 'success' ? 'Email введён корректно' : serverError ? serverError : ''
          // }
          hintTone={
            emailStatus === 'success' ? 'success' : emailStatus === 'error' ? 'error' : 'default'
          }
          onChange={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          isLast={false}
        />

        <AuthField
          label="Пароль"
          type="password"
          value={password}
          status={passwordStatus}
          hint={
            passwordFocused
              ? 'Минимум 8 символов, букв и цифры'
              : passwordStatus === 'success'
                ? 'Пароль подходит'
                : serverError
                  ? serverError
                  : ''
          }
          hintTone={
            passwordFocused
              ? 'default'
              : passwordStatus === 'success'
                ? 'success'
                : passwordStatus === 'error'
                  ? 'error'
                  : 'default'
          }
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((p) => !p)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isLast={true}
        />

        {/* <AuthField
          label="Пароль"
          type="password"
          value={password}
          status={passwordStatus}
          hint={passwordStatus === 'success' ? 'Пароль подходит' : serverError ? serverError : ''}
          hintTone={
            passwordStatus === 'success'
              ? 'success'
              : passwordStatus === 'error'
                ? 'error'
                : 'default'
          }
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((p) => !p)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isLast={true}
        /> */}

        <button type="button" className={styles.linkButton} onClick={onForgotPassword}>
          Забыли пароль?
        </button>

        <button className={styles.submitButton} disabled={!isSubmitEnabled}>
          {isLoading ? '...' : 'Войти'}
        </button>

        <AuthDivider />

        <p className={styles.footerText}>
          Нет аккаунта?{' '}
          <button type="button" className={styles.registerLink} onClick={onRegisterClick}>
            Зарегистрироваться
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
