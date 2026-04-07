import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthDivider, AuthField, AuthShell } from './index';
import styles from './AuthForm.module.scss';

type ForgotPasswordModalProps = {
  email?: string;
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onBackToLogin?: () => void;
  onRegisterClick?: () => void;
  onSubmit: (email: string) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordModal({
  email: initialEmail = '',
  isLoading,
  serverError,
  onClose,
  onBackToLogin,
  onRegisterClick,
  onSubmit
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isFocused, setIsFocused] = useState(false);

  // статус поля
  const fieldStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (isFocused) return 'focus';
    if (email.trim().length > 0 && emailRegex.test(email.trim())) return 'success';
    return 'default';
  }, [email, isFocused, serverError]);

  const stringError = serverError ? 'Такой пользователь не существует' : '';

  const isSubmitEnabled = emailRegex.test(email.trim()) && !isLoading;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;
    onSubmit(email.trim());
  };

  return (
    <AuthShell title="Сбросить пароль" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          id="forgot-email"
          type="email"
          label="Email"
          value={email}
          status={fieldStatus}
          hint={stringError}
          hintTone={serverError ? 'error' : 'default'}
          autoComplete="email"
          onChange={setEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          isLast={true}
        />

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

        <AuthDivider />

        <p className={styles.footerText}>
          {serverError ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            type="button"
            className={styles.footerLink}
            onClick={serverError ? onRegisterClick : onBackToLogin}
          >
            {serverError ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
