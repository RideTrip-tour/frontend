import { useEffect, useState } from 'react';
import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import EmailIcon from '@/assets/icons/email.svg';

type RegistrationEmailSentModalProps = {
  email: string;
  isLoading: boolean;
  serverError: string;
  onClose?: () => void;
  onResend?: () => void | Promise<void>;
};

export default function RegistrationEmailSentModal({
  email,
  isLoading,
  serverError,
  onClose,
  onResend
}: RegistrationEmailSentModalProps) {
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!onResend) return;
    await onResend();
    setCooldown(60);
  };

  const disabled = isLoading || cooldown > 0;

  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={`${styles.iconBox} ${styles.blueBox}`}>
          <img src={EmailIcon} alt="электронная почта" />
        </div>

        <h2 className={styles.bigTitle}>
          Подтвердите email —
          <br />и можно выбирать отдых
        </h2>

        <p className={styles.text}>
          Мы отправили письмо на <br />
          <strong>{email}</strong>
        </p>

        <p className={styles.text}>Письмо не пришло? Проверьте папку «Спам»</p>

        {serverError && <p className={styles.centerError}>{serverError}</p>}

        <button type="button" className={styles.linkButton} onClick={handleResend} disabled={disabled}>
          {isLoading ? 'Отправка...' : cooldown > 0 ? `Отправить ещё раз (${cooldown}с)` : 'Отправить ещё раз'}
        </button>
      </div>
    </AuthShell>
  );
}
