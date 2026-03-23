import { AuthShell } from './index';
import styles from './AuthState.module.scss';

type PasswordResetSuccessModalProps = {
  onClose?: () => void;
  onGoToCabinet?: () => void;
};

export default function PasswordResetSuccessModal({
  onClose,
  onGoToCabinet
}: PasswordResetSuccessModalProps) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={styles.planeIcon}>✈</div>

        <h2 className={styles.bigTitle}>
          Поздравляем, Вы успешно
          <br />
          изменили пароль
        </h2>

        <button type="button" className={styles.linkButton} onClick={onGoToCabinet}>
          Войти в кабинет
        </button>
      </div>
    </AuthShell>
  );
}
