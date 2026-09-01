import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthField from './AuthField';
import shellStyles from './AuthShell.module.scss';
import formStyles from './AuthForm.module.scss';
import CloseIcon from '@/assets/icons/close.svg';
import Loader from '@/assets/icons/loader.svg';

type ChangeEmailModalProps = {
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

export default function ChangeEmailModal({
  isLoading,
  serverError,
  onClose,
  onSubmit
}: ChangeEmailModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

  const emailStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (!email) return emailFocused ? 'focus' : 'default';
    return isEmailValid ? 'success' : 'error';
  }, [serverError, email, emailFocused, isEmailValid]);

  const passwordStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (!password) return passwordFocused ? 'focus' : 'default';
    return 'success';
  }, [serverError, password, passwordFocused]);

  const isSubmitEnabled = useMemo(() => {
    if (isLoading) return false;
    return isEmailValid && password.length > 0;
  }, [isLoading, isEmailValid, password]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    onSubmit({ email: cleanEmail, password });
  };

  return (
    <div className={shellStyles.overlay} onClick={onClose}>
      <motion.div
        className={shellStyles.modal}
        style={{ height: '672px', overflow: 'hidden', padding: '0 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={shellStyles.closeButton} onClick={onClose}>
          <img src={CloseIcon} alt="Закрыть" />
        </button>

        <h2 className={shellStyles.title}>
          <div style={{ position: 'relative', minHeight: '1.2em' }}>
            <AnimatePresence initial={false}>
              <motion.span
                key="change-email"
                style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Изменить email
              </motion.span>
            </AnimatePresence>
          </div>
        </h2>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          <AuthField
            id="change-email-new"
            type="email"
            label="Новый email"
            value={email}
            status={emailStatus}
            hintTone={emailStatus === 'success' ? 'success' : 'default'}
            autoComplete="email"
            onChange={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            isLast={false}
          />

          <AuthField
            id="change-email-password"
            type="password"
            label="Текущий пароль"
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

          {serverError && <p className={formStyles.centerError}>{serverError}</p>}

          <button
            type="submit"
            className={`${formStyles.submitButton} ${formStyles.updatePassword} ${isSubmitEnabled ? formStyles.submitActive : ''}`}
            disabled={!isSubmitEnabled}
            style={{ position: 'relative', zIndex: 10 }}
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
                    key="change-email"
                    style={{ position: 'absolute' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Изменить email
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
}