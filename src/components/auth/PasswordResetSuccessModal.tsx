import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import AirplaceIcon from '@/assets/icons/airplace.svg';

type PasswordResetSuccessModalProps = {
  onClose?: () => void;
  onGoToCabinet?: () => void;
};

export default function PasswordResetSuccessModal({
  onClose,
  onGoToCabinet
}: PasswordResetSuccessModalProps) {
  return (
    <AuthShell onClose={onClose} customStyle={{ padding: '122px 114px' }}>
      <div className={styles.centerContent}>
        <div className={styles.planeIcon}>
          <img src={AirplaceIcon} alt="Самолетик" />
        </div>

        <h2 className={styles.bigTitle}>Поздравляем, Вы успешно изменили пароль</h2>

        <button type="button" className={styles.linkButton} onClick={onGoToCabinet}>
          Войти в кабинет
        </button>
      </div>
    </AuthShell>
  );
}
