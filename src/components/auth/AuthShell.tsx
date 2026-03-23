import type { ReactNode } from 'react';
import styles from './AuthShell.module.scss';

type AuthShellProps = {
  title?: string;
  onClose?: () => void;
  children: ReactNode;
};

export default function AuthShell({ title, onClose, children }: AuthShellProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {title && <h2 className={styles.title}>{title}</h2>}

        {children}
      </div>
    </div>
  );
}
