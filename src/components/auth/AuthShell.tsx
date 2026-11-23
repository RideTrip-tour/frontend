import { motion } from 'framer-motion';
import { useId, type ReactNode } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import ModalOverlay from '@/shared/ui/base/ModalOverlay';

import styles from './AuthShell.module.scss';

type AuthShellProps = {
  title?: ReactNode;
  onClose?: () => void;
  className?: string;
  wideContent?: boolean;
  mobileLayout?: boolean;
  children: ReactNode;
};

export default function AuthShell({
  title,
  onClose,
  className,
  wideContent = false,
  mobileLayout = true,
  children,
}: AuthShellProps) {
  const titleId = useId();

  return (
    <ModalOverlay
      className={mobileLayout ? `${styles.overlay} ${styles.mobileOverlay}` : styles.overlay}
      onClose={onClose}
      ariaLabelledBy={title ? titleId : undefined}
    >
      <motion.div
        className={[
          styles.modal,
          wideContent && styles.wideContent,
          className,
          mobileLayout && styles.mobileLayout,
        ]
          .filter(Boolean)
          .join(' ')}
        initial={{ y: '100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
        >
          <img
            src={CloseIcon}
            alt="Закрыть"
          />
        </button>

        <div className={styles.content}>
          {mobileLayout && (
            <div
              className={styles.logo}
              aria-hidden="true"
            >
              LOGO
            </div>
          )}

          {title && (
            <h2
              id={titleId}
              className={styles.title}
            >
              {title}
            </h2>
          )}

          {children}
        </div>
      </motion.div>
    </ModalOverlay>
  );
}
