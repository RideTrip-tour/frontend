import type { ReactNode } from 'react';
import styles from './AuthShell.module.scss';
import CloseIcon from '@/assets/icons/close.svg';

type AuthShellProps = {
  title?: string;
  onClose?: () => void;
  customStyle?: React.CSSProperties;
  children: ReactNode;
};

export default function AuthShell({ title, onClose, customStyle, children }: AuthShellProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={customStyle}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <img src={CloseIcon} alt="Закрыть" />
        </button>

        {title && <h2 className={styles.title}>{title}</h2>}

        {children}
      </div>
    </div>
  );
}
