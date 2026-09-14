import { useEffect, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
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
  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose?.()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])
  
    useEffect(() => {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }, [])

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <motion.div
        className={styles.modal}
        style={customStyle}
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
