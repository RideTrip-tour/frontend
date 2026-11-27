import AuthShell from './AuthShell';

import styles from './AuthState.module.scss';

type PasswordResetErrorModalProps = {
  onClose: () => void;
  onRequestNewLink: () => void;
};

export default function PasswordResetErrorModal({
  onClose,
  onRequestNewLink,
}: Readonly<PasswordResetErrorModalProps>) {
  return (
    <AuthShell onClose={onClose}>
      <div className={styles.centerContent}>
        <h2 className={styles.bigTitle}>Не удалось открыть форму сброса пароля</h2>
        <p
          className={styles.text}
          role="alert"
        >
          Ссылка для сброса пароля неполная. Откройте полную ссылку из письма или запросите новую.
        </p>
        <button
          type="button"
          className={styles.linkButton}
          onClick={onRequestNewLink}
        >
          Запросить новую ссылку
        </button>
      </div>
    </AuthShell>
  );
}
