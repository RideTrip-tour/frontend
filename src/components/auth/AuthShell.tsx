import { motion } from 'framer-motion';
import { useId, type ReactNode } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import ModalOverlay from '@/shared/ui/base/ModalOverlay';

import styles from './AuthShell.module.scss';

type AuthShellProps = {
  title?: string;
  onClose?: () => void;
  customStyle?: React.CSSProperties;
  children: ReactNode;
};

export default function AuthShell({ title, onClose, customStyle, children }: AuthShellProps) {
  const titleId = useId();
  return (
    <ModalOverlay
      className={styles.overlay}
      onClose={onClose}
      ariaLabelledBy={title ? titleId : undefined}
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

        {title && (
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
        )}

        {children}
      </motion.div>
    </ModalOverlay>
  );
}
