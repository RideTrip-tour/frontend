import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import AirplaceIcon from '@/assets/icons/airplace.svg';

type RegistrationSuccessModalProps = {
  onClose?: () => void;
  onHomeClick?: () => void;
};

export default function RegistrationSuccessModal({
  onClose,
  onHomeClick
}: RegistrationSuccessModalProps) {
  return (
    <AuthShell onClose={onClose} customStyle={{ padding: '122px 114px' }}>
      <div className={styles.centerContent}>
        <div className={styles.planeIcon}>
          <img src={AirplaceIcon} alt="Самолетик" />
        </div>

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
