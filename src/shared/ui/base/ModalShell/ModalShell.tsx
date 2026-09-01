import style from './modalshell.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import CloseIcon from '@/assets/icons/close.svg'

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="overlay"
          className={style.overlay}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            className={style.modal}
            initial={{ y: '100vh', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100vh', opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={style.closeButton} onClick={onClose}>
              <img src={CloseIcon} alt="Закрыть" />
            </button>

            {title && <h2 className={style.title}>{title}</h2>}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ModalShell
