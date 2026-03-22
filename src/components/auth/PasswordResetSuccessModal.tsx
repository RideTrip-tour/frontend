import styles from './PasswordResetSuccessModal.module.scss';

type PasswordResetSuccessModalProps = {
  onClose?: () => void;
  onGoToCabinet?: () => void;
};

export default function PasswordResetSuccessModal({
  onClose,
  onGoToCabinet
}: PasswordResetSuccessModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className={styles.icon}>✈</div>

        <h2 className={styles.title}>
          Поздравляем, Вы успешно
          <br />
          изменили пароль
        </h2>

        <button type="button" className={styles.linkButton} onClick={onGoToCabinet}>
          Войти в кабинет
        </button>
      </div>
    </div>
  );
}
