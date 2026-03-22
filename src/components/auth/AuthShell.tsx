import type { ReactNode } from 'react';
import styles from './AuthShell.module.scss';

type AuthShellProps = {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
  compact?: boolean;
};

export default function AuthShell({ title, onClose, children, compact = false }: AuthShellProps) {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${compact ? styles.compact : ''}`}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {title ? <h2 className={styles.title}>{title}</h2> : null}

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
