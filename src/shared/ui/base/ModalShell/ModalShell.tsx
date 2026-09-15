import style from './modalshell.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import { useId, type ReactNode } from 'react';
import CloseIcon from '@/assets/icons/close.svg'
import ModalOverlay from '@/shared/ui/base/ModalOverlay'

interface ModalShellProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

const ModalShell = ({
  isOpen,
  title,
  onClose,
  children
}: ModalShellProps) => {
  const titleId = useId()

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          key="overlay"
          className={style.overlay}
          onClose={onClose}
          ariaLabelledBy={title ? titleId : undefined}
        >
          <motion.div
            key="modal"
            className={style.modal}
            initial={{ y: '100vh', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100vh', opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <button type="button" className={style.closeButton} onClick={onClose}>
              <img src={CloseIcon} alt="Закрыть" />
            </button>

            {title && <h2 id={titleId} className={style.title}>{title}</h2>}

            {children}
          </motion.div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  )
}

export default ModalShell
