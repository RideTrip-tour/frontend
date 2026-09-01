import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
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
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        style={customStyle}
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <img src={CloseIcon} alt="Закрыть" />
        </button>

        {title && <h2 className={styles.title}>{title}</h2>}

        {children}
      </motion.div>
    </div>
  );
}
