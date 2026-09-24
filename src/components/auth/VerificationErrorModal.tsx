import AuthShell from './AuthShell';
import styles from './AuthState.module.scss';

type VerificationErrorModalProps = {
  message: string;
  onClose: () => void;
  onRetry?: () => void;
};

export default function VerificationErrorModal({ message, onClose, onRetry }: Readonly<VerificationErrorModalProps>) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <h2 className={styles.bigTitle}>Не удалось подтвердить почту</h2>
        <p className={styles.text} role="alert">{message}</p>
        <div className={styles.verificationActions}>
          {onRetry && (
            <button type="button" className={styles.linkButton} onClick={onRetry}>
              Попробовать ещё раз
            </button>
          )}
          <button type="button" className={styles.linkButton} onClick={onClose}>
            На главную
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
