import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthDivider, AuthCheckbox } from './index';
import AuthField from './AuthField';
import shellStyles from './AuthShell.module.scss';
import formStyles from './AuthForm.module.scss';
import CloseIcon from '@/assets/icons/close.svg';
import Loader from '@/assets/icons/loader.svg';

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
    }
  ) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const passwordHint = 'Минимум 8 символов, латиница, буквы и цифры';

const t = { duration: 0.25, ease: 'easeInOut' } as const;

export default function UnifiedAuthModal({
  initialView = 'login',
  isLoading,
  serverError,
  onClose,
  onClearError,
  onSubmit
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
  const cleanPassword = password.trim();
  const cleanConfirmPassword = confirmPassword.trim();

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
    if (cleanPassword.length < 8) return false;
    if (/[а-яА-Я]/.test(cleanPassword)) return false;
    if (/[^a-zA-Z0-9]/.test(cleanPassword)) return false;
    if (!/[a-zA-Z]/.test(cleanPassword)) return false;
    if (!/\d/.test(cleanPassword)) return false;
    return true;
  }, [password, cleanPassword, view]);

  const passwordsMatch = useMemo(() => {
    return (
      cleanPassword.length > 0 &&
      cleanConfirmPassword.length > 0 &&
      cleanPassword === cleanConfirmPassword
    );
  }, [cleanPassword, cleanConfirmPassword]);

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
    if (view === 'register') return isEmailValid && isPasswordValid && passwordsMatch && acceptedTerms;
    if (view === 'forgot') return isEmailValid;
    return false;
  }, [view, email, password, isEmailValid, isPasswordValid, passwordsMatch, acceptedTerms, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    onSubmit(view, {
      email: cleanEmail,
      password: view !== 'forgot' ? password : undefined,
      confirmPassword: view === 'register' ? confirmPassword : undefined,
      acceptedTerms: view === 'register' ? acceptedTerms : undefined
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

  return (
    <div className={shellStyles.overlay}>
      <div className={shellStyles.modal} style={{ height: '672px', overflow: 'hidden', padding: '0 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <button type="button" className={shellStyles.closeButton} onClick={onClose}>
          <img src={CloseIcon} alt="Закрыть" />
        </button>

        <motion.h2 layout="position" className={shellStyles.title} transition={t}>
          <div style={{ position: 'relative', minHeight: '1.2em' }}>
            <AnimatePresence initial={false}>
              <motion.span
                key={view}
                style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {title}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h2>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          <motion.div layout="position" transition={t}>
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
              isLast={view === 'forgot'}
            />
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {view === 'forgot' && (
              <motion.p
                key="forgot-description"
                layout="position"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeInOut' } }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.2, ease: 'easeInOut' } }}
                className={formStyles.description}
              >
                Мы отправим ссылку для создания
                <br />
                нового пароля.
              </motion.p>
            )}

            {view !== 'forgot' && (
              <motion.div
                key="password-field-wrapper"
                layout="position"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={t}
              >
                <AuthField
                  id="unified-password"
                  type="password"
                  label="Пароль"
                  value={password}
                  status={passwordStatus}
                  hint={view === 'register' ? passwordHint : undefined}
                  hintTone={
                    view === 'register'
                      ? passwordStatus === 'error'
                        ? 'error'
                        : passwordStatus === 'success'
                          ? 'success'
                          : 'default'
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
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div
                key="register-extras"
                layout="position"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={t}
              >
                <AuthField
                  id="unified-confirm-password"
                  type="password"
                  label="Повторите пароль"
                  value={confirmPassword}
                  status={confirmStatus}
                  showToggle
                  isPasswordVisible={showConfirmPassword}
                  onToggleVisibility={() => setShowConfirmPassword((p) => !p)}
                  onChange={setConfirmPassword}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  isLast={false}
                />

                <AuthCheckbox checked={acceptedTerms} onChange={setAcceptedTerms}>
                  <span>
                    Я соглашаюсь с{' '}
                    <button type="button" className={formStyles.linkButtonInline} onClick={() => console.log('terms')}>
                      Условиями использования
                    </button>
                  </span>
                </AuthCheckbox>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false} mode="popLayout">
            {view === 'login' && (
              <motion.div
                key="forgot-password-link"
                layout="position"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <button
                  type="button"
                  className={formStyles.linkButton}
                  onClick={() => switchView('forgot')}
                >
                  Забыли пароль?
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {serverError && <p className={formStyles.centerError}>{serverError}</p>}

          <motion.div layout="position" transition={t}>
            <motion.button
              layout="position"
              type="submit"
              className={`${formStyles.submitButton} ${isSubmitEnabled ? formStyles.submitActive : ''}`}
              disabled={!isSubmitEnabled || isLoading}
              transition={t}
            >
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '48px' }}>
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
                      {view === 'login' ? 'Войти' : view === 'register' ? 'Создать аккаунт' : 'Сбросить пароль'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>

            <AuthDivider />

            <motion.div layout="position" className={formStyles.footerText}>
              <div style={{ position: 'relative', minHeight: '1.2em' }}>
                <AnimatePresence initial={false}>
                  {view === 'login' && (
                    <motion.span
                      key="login"
                      style={{ position: 'absolute', left: 0, right: 0 }}
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
                      style={{ position: 'absolute', left: 0, right: 0 }}
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
                      style={{ position: 'absolute', left: 0, right: 0 }}
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
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
