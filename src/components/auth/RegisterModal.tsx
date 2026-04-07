import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthField, AuthShell, AuthDivider, AuthCheckbox } from './index';
import styles from './AuthForm.module.scss';
import Loader from '@/assets/icons/loader.svg';

type RegisterModalProps = {
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onLoginClick?: () => void;
  onTermsClick?: () => void;
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const passwordHint = 'Минимум 8 символов, буквы и цифры';

export default function RegisterModal({
  isLoading,
  serverError,
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

  const cleanEmail = email.trim();
  const cleanPassword = password.trim();
  const cleanConfirmPassword = confirmPassword.trim();

  const emailValid = useMemo(() => {
    if (cleanEmail.length < 8) return false;

    const parts = cleanEmail.split('@');
    if (parts.length !== 2) return false;

    const local = parts[0];
    const domain = parts[1];

    if (!/^[A-Za-z0-9._-]+$/.test(local)) return false;
    if (!domain.includes('.')) return false;

    return true;
  }, [cleanEmail]);

  const passwordValid = useMemo(() => {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(cleanPassword);
  }, [cleanPassword]);

  const passwordsMatch = useMemo(() => {
    return (
      cleanPassword.length > 0 &&
      cleanConfirmPassword.length > 0 &&
      cleanPassword === cleanConfirmPassword
    );
  }, [cleanPassword, cleanConfirmPassword]);

  const hasMismatchError = useMemo(() => {
    return cleanConfirmPassword.length > 0 && !passwordsMatch;
  }, [cleanConfirmPassword, passwordsMatch]);

  const passwordsAreOk = useMemo(() => {
    return passwordValid && passwordsMatch;
  }, [passwordValid, passwordsMatch]);

  const emailStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (emailValid) return 'success';
    if (emailFocused) return 'focus';
    return 'default';
  }, [serverError, emailValid, emailFocused]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (serverError || hasMismatchError) return 'error';
    if (passwordValid) return 'success';
    if (passwordFocused) return 'focus';
    return 'default';
  }, [serverError, hasMismatchError, passwordValid, passwordFocused]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (serverError || hasMismatchError) return 'error';
    if (passwordsAreOk) return 'success';
    if (confirmFocused) return 'focus';
    return 'default';
  }, [serverError, hasMismatchError, passwordsAreOk, confirmFocused]);

  const isSubmitEnabled =
    emailValid && passwordValid && passwordsMatch && acceptedTerms && !isLoading;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    onSubmit({
      email: cleanEmail,
      password: cleanPassword,
      confirmPassword: cleanConfirmPassword,
      acceptedTerms
    });
  };

  return (
    <AuthShell title="Регистрация" onClose={onClose} customStyle={{ padding: '36px 130px' }}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <AuthField
          id="register-email"
          type="email"
          label="Email"
          value={email}
          status={emailStatus}
          hintTone={emailStatus === 'success' ? 'success' : 'default'}
          onChange={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          isLast={false}
        />

        <AuthField
          id="register-password"
          type="password"
          label="Пароль"
          value={password}
          status={passwordStatus}
          hint={passwordHint}
          hintTone={
            passwordStatus === 'error'
              ? 'error'
              : passwordStatus === 'success'
                ? 'success'
                : 'default'
          }
          showToggle
          isPasswordVisible={showPassword}
          onToggleVisibility={() => setShowPassword((prev) => !prev)}
          onChange={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          isLast={false}
        />

        <AuthField
          id="register-confirm-password"
          type="password"
          label="Повторите пароль"
          value={confirmPassword}
          status={confirmStatus}
          hint={passwordHint}
          hintTone={
            confirmStatus === 'error'
              ? 'error'
              : confirmStatus === 'success'
                ? 'success'
                : 'default'
          }
          showToggle
          isPasswordVisible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((prev) => !prev)}
          onChange={setConfirmPassword}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
          isLast={false}
        />

        <AuthCheckbox checked={acceptedTerms} onChange={setAcceptedTerms}>
          <span>
            Я соглашаюсь с{' '}
            <button type="button" className={styles.linkButtonInline} onClick={onTermsClick}>
              Условиями использования
            </button>
          </span>
        </AuthCheckbox>

        {hasMismatchError && (
          <p className={`${styles.notifyPassword} ${styles.centerError}`}>Пароли не совпадают</p>
        )}

        {passwordsAreOk && (
          <p className={`${styles.notifyPassword} ${styles.centerSuccess}`}>Пароли совпадают</p>
        )}

        <button
          type="submit"
          className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitActive : ''}`}
          disabled={!isSubmitEnabled}
        >
          {isLoading ? (
            <img src={Loader} alt="Загрузка" className={styles.loader} />
          ) : (
            'Создать аккаунт'
          )}
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
