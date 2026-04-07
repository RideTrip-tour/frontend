import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import EmailIcon from '@/assets/icons/email.svg';
import Loader from '@/assets/icons/loader.svg';

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

        <button type="button" className={styles.linkButton} onClick={onResend} disabled={isLoading}>
          {isLoading ? (
            <img src={Loader} alt="Загрузка" className={styles.loader} />
          ) : (
            'Отправить ещё раз'
          )}
        </button>
      </div>
    </AuthShell>
  );
}
