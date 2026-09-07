import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthField from './AuthField';
import shellStyles from './AuthShell.module.scss';
import formStyles from './AuthForm.module.scss';
import CloseIcon from '@/assets/icons/close.svg';
import Loader from '@/assets/icons/loader.svg';

type ChangePasswordModalProps = {
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onSubmit: (data: { current_password: string; new_password: string }) => void | Promise<void>;
};

type FieldStatus = 'default' | 'focus' | 'success' | 'error';

const passwordHint = 'Минимум 8 символов, латиница, буквы и цифры';

export default function ChangePasswordModal({
  isLoading,
  serverError,
  onClose,
  onSubmit
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const cleanNewPassword = newPassword.trim();
  const cleanConfirmPassword = confirmPassword.trim();

  const isNewPasswordValid = useMemo(() => {
    if (cleanNewPassword.length < 8) return false;
    if (/[а-яА-Я]/.test(cleanNewPassword)) return false;
    if (/[^a-zA-Z0-9]/.test(cleanNewPassword)) return false;
    if (!/[a-zA-Z]/.test(cleanNewPassword)) return false;
    if (!/\d/.test(cleanNewPassword)) return false;
    return true;
  }, [cleanNewPassword]);

  const passwordsMatch = useMemo(() => {
    return (
      cleanNewPassword.length > 0 &&
      cleanConfirmPassword.length > 0 &&
      cleanNewPassword === cleanConfirmPassword
    );
  }, [cleanNewPassword, cleanConfirmPassword]);

  const currentStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    return currentFocused ? 'focus' : 'default';
  }, [serverError, currentFocused]);

  const newPasswordStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (!newPassword) return newFocused ? 'focus' : 'default';
    return isNewPasswordValid ? 'success' : 'error';
  }, [serverError, newPassword, newFocused, isNewPasswordValid]);

  const confirmStatus: FieldStatus = useMemo(() => {
    if (serverError) return 'error';
    if (!confirmPassword) return confirmFocused ? 'focus' : 'default';
    return passwordsMatch ? 'success' : 'error';
  }, [serverError, confirmPassword, confirmFocused, passwordsMatch]);

  const isSubmitEnabled = useMemo(() => {
    if (isLoading) return false;
    return currentPassword.length > 0 && isNewPasswordValid && passwordsMatch;
  }, [isLoading, currentPassword, isNewPasswordValid, passwordsMatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;

    onSubmit({
      current_password: currentPassword,
      new_password: newPassword
    });
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
                key="change-password"
                style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Изменить пароль
              </motion.span>
            </AnimatePresence>
          </div>
        </h2>

        <form className={formStyles.form} onSubmit={handleSubmit}>
          <AuthField
            id="change-password-current"
            type="password"
            label="Текущий пароль"
            value={currentPassword}
            status={currentStatus}
            autoComplete="current-password"
            showToggle
            isPasswordVisible={showCurrent}
            onToggleVisibility={() => setShowCurrent((p) => !p)}
            onChange={setCurrentPassword}
            onFocus={() => setCurrentFocused(true)}
            onBlur={() => setCurrentFocused(false)}
            isLast={false}
          />

          <AuthField
            id="change-password-new"
            type="password"
            label="Новый пароль"
            value={newPassword}
            status={newPasswordStatus}
            hint={passwordHint}
            hintTone={
              newPasswordStatus === 'error'
                ? 'error'
                : newPasswordStatus === 'success'
                  ? 'success'
                  : 'default'
            }
            autoComplete="new-password"
            showToggle
            isPasswordVisible={showNew}
            onToggleVisibility={() => setShowNew((p) => !p)}
            onChange={setNewPassword}
            onFocus={() => setNewFocused(true)}
            onBlur={() => setNewFocused(false)}
            isLast={false}
          />

          <AuthField
            id="change-password-confirm"
            type="password"
            label="Повторите пароль"
            value={confirmPassword}
            status={confirmStatus}
            autoComplete="new-password"
            showToggle
            isPasswordVisible={showConfirm}
            onToggleVisibility={() => setShowConfirm((p) => !p)}
            onChange={setConfirmPassword}
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
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
                    key="change-password"
                    style={{ position: 'absolute' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Изменить пароль
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