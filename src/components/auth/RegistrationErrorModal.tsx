import { AuthShell } from './index';
import styles from './AuthState.module.scss';
import WarningIcon from '@/assets/icons/warning.svg';

type RegistrationErrorModalProps = {
  onClose?: () => void;
  onRetry?: () => void;
};

export default function RegistrationErrorModal({ onClose, onRetry }: RegistrationErrorModalProps) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={styles.iconBox}>
          <img src={WarningIcon} alt="Ошибка при регистрации" />
        </div>

        <h2 className={styles.bigTitle}>
          Произошла ошибка
          <br />
          при регистрации
        </h2>

        <p className={styles.text}>
          Попробуйте пройти{' '}
          <button type="button" className={styles.linkInline} onClick={onRetry}>
            регистрацию
          </button>{' '}
          ещё раз
        </p>
      </div>
    </AuthShell>
  );
}
