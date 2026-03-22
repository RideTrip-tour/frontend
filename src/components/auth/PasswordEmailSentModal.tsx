import styles from './PasswordEmailSentModal.module.scss';

type PasswordEmailSentModalProps = {
  onClose?: () => void;
  onResend?: () => void;
};

export default function PasswordEmailSentModal({ onClose, onResend }: PasswordEmailSentModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className={styles.icon}>✉</div>

        <h2 className={styles.title}>
          Письмо уже отправлено
          <br />
          на вашу почту
        </h2>

        <p className={styles.text}>Письмо не пришло? Проверьте папку «Спам»</p>

        <button type="button" className={styles.linkButton} onClick={onResend}>
          Отправить ещё раз
        </button>
      </div>
    </div>
  );
}
