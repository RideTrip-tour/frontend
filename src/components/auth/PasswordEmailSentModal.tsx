import { AuthShell } from './index';
import styles from './AuthState.module.scss';

type PasswordEmailSentModalProps = {
  onClose?: () => void;
  onResend?: () => void;
};

export default function PasswordEmailSentModal({ onClose, onResend }: PasswordEmailSentModalProps) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={`${styles.iconBox} ${styles.blueBox}`}>✉</div>

        <h2 className={styles.bigTitle}>
          Письмо уже отправлено
          <br />
          на вашу почту
        </h2>

        <p className={styles.text}>Письмо не пришло? Проверьте папку «Спам»</p>

        <button type="button" className={styles.linkButton} onClick={onResend}>
          Отправить ещё раз
        </button>
      </div>
    </AuthShell>
  );
}
