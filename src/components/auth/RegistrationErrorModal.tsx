import { AuthShell } from './index';
import styles from './RegistrationState.module.scss';

type RegistrationErrorModalProps = {
  onClose?: () => void;
  onRetry?: () => void;
};

export default function RegistrationErrorModal({ onClose, onRetry }: RegistrationErrorModalProps) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <div className={`${styles.iconBox} ${styles.redBox}`}>!</div>

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
