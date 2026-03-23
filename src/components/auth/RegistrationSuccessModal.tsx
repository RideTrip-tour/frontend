import { AuthShell } from './index';
import styles from './AuthState.module.scss';

type RegistrationSuccessModalProps = {
  onClose?: () => void;
  onHomeClick?: () => void;
};

export default function RegistrationSuccessModal({
  onClose,
  onHomeClick
}: RegistrationSuccessModalProps) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={styles.planeIcon}>✈</div>

        <h2 className={styles.bigTitle}>
          Поздравляем, Вы успешно
          <br />
          зарегистрированы
          <br />
          на платформе
        </h2>

        <button type="button" className={styles.linkButton} onClick={onHomeClick}>
          На главную
        </button>
      </div>
    </AuthShell>
  );
}
