import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, type FormEvent } from 'react';

import Loader from '@/assets/icons/loader.svg';
import { isValidPassword, PASSWORD_HINT } from '@/features/auth/lib/passwordValidation';
import { getLegalDocumentPath } from '@/shared/config';

import AuthCheckbox from './AuthCheckbox';
import AuthDivider from './AuthDivider';
import AuthField from './AuthField';
import AuthShell from './AuthShell';

import formStyles from './AuthForm.module.scss';
import styles from './UnifiedAuthModal.module.scss';

type UnifiedAuthModalProps = {
  initialView?: 'login' | 'register' | 'forgot';
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onClearError?: () => void;
  onSubmit: (
    view: 'login' | 'register' | 'forgot',
    data: {
      email: string;
      password?: string;
      confirmPassword?: string;
      acceptedTerms?: boolean;
    },
  ) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

export default function UnifiedAuthModal({
  initialView = 'login',
  isLoading,
  serverError,
  onClose,
  onClearError,
  onSubmit,
}: UnifiedAuthModalProps) {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialView);

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

  const isEmailValid = useMemo(() => {
    const trimmed = cleanEmail;
    if (trimmed.length < 5) return false;
    const atIndex = trimmed.indexOf('@');
    if (atIndex < 1) return false;
    if (atIndex === trimmed.length - 1) return false;
    const afterAt = trimmed.slice(atIndex + 1);
    const dotIndex = afterAt.indexOf('.');
    if (dotIndex < 1) return false;
    if (dotIndex === afterAt.length - 1) return false;
    return true;
  }, [cleanEmail]);

  const isPasswordValid = useMemo(() => {
    if (view === 'login') {
      return password.length >= 8;
    }
    return isValidPassword(password);
  }, [password, view]);

  const passwordsMatch = useMemo(() => {
    return password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  const emailStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (view === 'login') return emailFocused ? 'focus' : 'default';
    if (!email) return emailFocused ? 'focus' : 'default';
    return isEmailValid ? 'success' : 'error';
  }, [email, isEmailValid, emailFocused, serverError, view]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (view === 'login') return passwordFocused ? 'focus' : 'default';
    if (!password) return passwordFocused ? 'focus' : 'default';
    return isPasswordValid ? 'success' : 'error';
  }, [password, isPasswordValid, passwordFocused, serverError, view]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (!confirmPassword) return confirmFocused ? 'focus' : 'default';
    return passwordsMatch ? 'success' : 'error';
  }, [confirmPassword, passwordsMatch, confirmFocused, serverError]);

  const isSubmitEnabled = useMemo(() => {
    if (isLoading) return false;
    if (view === 'login') return email.length > 0 && password.length > 0;
    if (view === 'register')
      return isEmailValid && isPasswordValid && passwordsMatch && acceptedTerms;
    if (view === 'forgot') return isEmailValid;
    return false;
  }, [
    view,
    email,
    password,
    isEmailValid,
    isPasswordValid,
    passwordsMatch,
    acceptedTerms,
    isLoading,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    onSubmit(view, {
      email: cleanEmail,
      password: view !== 'forgot' ? password : undefined,
      confirmPassword: view === 'register' ? confirmPassword : undefined,
      acceptedTerms: view === 'register' ? acceptedTerms : undefined,
    });
  };

  const title = useMemo(() => {
    if (view === 'login') return 'Добро пожаловать!';
    if (view === 'register') return 'Регистрация';
    return 'Сбросить пароль';
  }, [view]);

  const switchView = (newView: 'login' | 'register' | 'forgot') => {
    onClearError?.();
    setView(newView);
  };

  const contentHeight = useMemo(() => {
    if (view === 'login') return 120;
    if (view === 'register') return 250;
    return 50;
  }, [view]);

  return (
    <AuthShell
      className={styles.modal}
      onClose={onClose}
      title={
        <span className={styles.animatedText}>
          <AnimatePresence
            initial={false}
            mode="popLayout"
          >
            <motion.span
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {title}
            </motion.span>
          </AnimatePresence>
        </span>
      }
    >
      <form
        className={`${formStyles.form} ${formStyles.mobileForm}`}
        onSubmit={handleSubmit}
      >
        <AuthField
          id="unified-email"
          type="email"
          label="Email"
          value={email}
          status={emailStatus}
          hintTone={emailStatus === 'success' ? 'success' : 'default'}
          autoComplete="email"
          onChange={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          isLast={false}
        />

        <motion.div
          className={styles.viewContent}
          initial={false}
          animate={{ '--auth-view-height': `${contentHeight}px` }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <AnimatePresence
            initial={false}
            mode="popLayout"
          >
            {view === 'forgot' && (
              <motion.p
                key="forgot-description"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={`${formStyles.description} ${styles.viewDescription}`}
              >
                Мы отправим ссылку для создания
                <br />
                нового пароля.
              </motion.p>
            )}

            {view === 'login' && (
              <motion.div
                key="login-password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <AuthField
                  id="unified-login-password"
                  type="password"
                  label="Пароль"
                  value={password}
                  status={passwordStatus}
                  autoComplete="current-password"
                  showToggle
                  isPasswordVisible={showPassword}
                  onToggleVisibility={() => setShowPassword((p) => !p)}
                  onChange={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  isLast
                />

                <button
                  type="button"
                  className={formStyles.linkButton}
                  onClick={() => switchView('forgot')}
                >
                  Забыли пароль?
                </button>
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <AuthField
                  id="unified-register-password"
                  type="password"
                  label="Пароль"
                  value={password}
                  status={passwordStatus}
                  autoComplete="new-password"
                  hint={PASSWORD_HINT}
                  hintTone={
                    passwordStatus === 'error'
                      ? 'error'
                      : passwordStatus === 'success'
                        ? 'success'
                        : 'default'
                  }
                  showToggle
                  isPasswordVisible={showPassword}
                  onToggleVisibility={() => setShowPassword((p) => !p)}
                  onChange={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  isLast={false}
                />

                <AuthField
                  id="unified-confirm-password"
                  type="password"
                  label="Повторите пароль"
                  value={confirmPassword}
                  status={confirmStatus}
                  autoComplete="new-password"
                  hint={PASSWORD_HINT}
                  hintClassName={styles.confirmHint}
                  showToggle
                  isPasswordVisible={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((p) => !p)}
                  onChange={setConfirmPassword}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  isLast={false}
                />

                <AuthCheckbox
                  checked={acceptedTerms}
                  onChange={setAcceptedTerms}
                >
                  <span className={styles.consentDesktop}>Я соглашаюсь с</span>
                  <span className={styles.consentMobile}>Согласен с</span>{' '}
                  <a
                    href={getLegalDocumentPath('terms-of-service')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={formStyles.linkButtonInline}
                  >
                    Условиями использования
                  </a>
                </AuthCheckbox>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {serverError && <p className={formStyles.centerError}>{serverError}</p>}

        <button
          type="submit"
          className={`${formStyles.submitButton} ${isSubmitEnabled ? formStyles.submitActive : ''}`}
          disabled={!isSubmitEnabled || isLoading}
          style={{ position: 'relative', zIndex: 10 }}
        >
          <span className={styles.submitContent}>
            <AnimatePresence initial={false}>
              {isLoading ? (
                <motion.img
                  key="loader"
                  style={{ position: 'absolute' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  src={Loader}
                  alt="Загрузка"
                  className={formStyles.loader}
                />
              ) : (
                <motion.span
                  key={view}
                  style={{ position: 'absolute' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {view === 'login'
                    ? 'Войти'
                    : view === 'register'
                      ? 'Создать аккаунт'
                      : 'Сбросить пароль'}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>

        <AuthDivider />

        <div className={formStyles.footerText}>
          <div className={styles.animatedText}>
            <AnimatePresence
              initial={false}
              mode="popLayout"
            >
              {view === 'login' && (
                <motion.span
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    className={formStyles.registerLink}
                    onClick={() => switchView('register')}
                  >
                    Зарегистрироваться
                  </button>
                </motion.span>
              )}
              {view === 'register' && (
                <motion.span
                  key="register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    className={formStyles.footerLink}
                    onClick={() => switchView('login')}
                  >
                    Войти
                  </button>
                </motion.span>
              )}
              {view === 'forgot' && (
                <motion.span
                  key="forgot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Вспомнили пароль?{' '}
                  <button
                    type="button"
                    className={formStyles.footerLink}
                    onClick={() => switchView('login')}
                  >
                    Войти
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
