import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthDivider, AuthField, AuthShell } from './index';
import styles from './AuthForm.module.scss';

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

  const hasServerError = Boolean(serverError);
  const isFilled = email.trim().length > 0;
  const isValid = emailRegex.test(email.trim());

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
    <AuthShell title="Сбросить пароль" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          id="forgot-email"
          type="email"
          label="Email"
          value={email}
          status={fieldStatus}
          hint={hasServerError ? serverError : ''}
          hintTone={hasServerError ? 'error' : 'default'}
          autoComplete="email"
          onChange={setEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          isLast={true} // последний элемент формы перед описанием
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
          {hasServerError ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            type="button"
            className={styles.footerLink}
            onClick={hasServerError ? onRegisterClick : onBackToLogin}
          >
            {hasServerError ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </form>
    </AuthShell>
  );
}
