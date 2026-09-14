import style from './modalshell.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
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

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  useEffect(() => {
  if (!isOpen) return

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') onClose()
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isOpen, onClose])

useEffect(() => {
  if (!isOpen) return

  const prev = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  return () => {
    document.body.style.overflow = prev
  }
}, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="overlay"
          className={style.overlay}
          onClick={handleOverlayClick}
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

            {title && <h2 className={style.title}>{title}</h2>}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ModalShell

