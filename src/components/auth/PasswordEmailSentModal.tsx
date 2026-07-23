import { useEffect, useState } from 'react';
import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import EmailIcon from '@/assets/icons/email.svg';
import { apiClient } from '@/api/client';
import { getErrorMessage } from '@/api/authErrorCodes';

type PasswordEmailSentModalProps = {
  email: string;
  isLoading: boolean;
  onClose?: () => void;
  setIsLoading: (loading: boolean) => void;
  setServerError: (error: string) => void;
};

export default function PasswordEmailSentModal({
  email,
  isLoading,
  onClose,
  setIsLoading,
  setServerError
}: PasswordEmailSentModalProps) {
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    setCooldown(60);
  }, []);

  const handleResend = async () => {
    setServerError('');
    setIsLoading(true);

    try {
      await apiClient.post('/auth/forgot-password', { email });
      setCooldown(60);
    } catch (err: any) {
      const rawDetail = err.response?.data?.detail ?? err.data?.detail;
      const translated = getErrorMessage(rawDetail);
      setServerError(translated ?? err.message ?? 'Ошибка сервера');
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || cooldown > 0;

  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={`${styles.iconBox} ${styles.blueBox}`}>
          <img src={EmailIcon} alt="электронная почта" />
        </div>

        <h2 className={styles.bigTitle}>
          Письмо уже отправлено
          <br />
          на вашу почту
        </h2>

        <p className={styles.text}>Письмо не пришло? Проверьте папку «Спам»</p>

        <button type="button" className={styles.linkButton} onClick={handleResend} disabled={disabled}>
          {isLoading ? 'Отправка...' : cooldown > 0 ? `Отправить ещё раз (${cooldown}с)` : 'Отправить ещё раз'}
        </button>
      </div>
    </AuthShell>
  );
}
