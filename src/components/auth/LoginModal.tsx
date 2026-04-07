import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthDivider, AuthShell } from './index';
import AuthField from './AuthField';
import styles from './AuthForm.module.scss';
import Loader from '@/assets/icons/loader.svg';

type Props = {
  isLoading?: boolean;
  serverError?: string;
  onClose?: () => void;
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>;
  onForgotPassword?: () => void;
  onRegisterClick?: () => void;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

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

  const isEmailValid = useMemo(() => {
    const trimmed = email.trim();
    if (trimmed.length < 8) return false;

    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;

    const local = parts[0];
    const domain = parts[1];

    if (!/^[A-Za-z]+$/.test(local)) return false;

    if (!domain.includes('.')) return false;

    return true;
  }, [email]);

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
          status={serverError ? 'error' : emailStatus}
          hintTone={emailStatus === 'success' ? 'success' : 'default'}
          onChange={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          isLast={false}
        />

        <AuthField
          label="Пароль"
          type="password"
          value={password}
          status={serverError ? 'error' : passwordStatus}
          // hint={
          //   passwordFocused || serverError
          //     ? 'Минимум 8 символов, букв и цифры'
          //     : passwordStatus === 'success'
          //       ? 'Минимум 8 символов, букв и цифры'
          //       : ''
          // }
          hintTone={
            passwordFocused ? 'default' : passwordStatus === 'success' ? 'success' : 'default'
          }
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((p) => !p)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isLast={true}
        />

        <button type="button" className={styles.linkButton} onClick={onForgotPassword}>
          Забыли пароль?
        </button>

        {serverError && <p className={styles.centerError}>{serverError}</p>}

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled || !!serverError}
        >
          {isLoading ? <img src={Loader} alt="Загрузка" className={styles.loader} /> : 'Войти'}
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
