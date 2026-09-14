import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import style from './modalchildren.module.scss'
import './variables.css'
import { useEffect, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';

interface ModalChildrenProps {
  onClose: () => void
  children: ReactNode
}

const ModalChildren = ({ onClose, children }: ModalChildrenProps) => {
  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return createPortal(
    <div
      className={style.overlay}
      onClick={handleOverlayClick}
    >
      <div className={style.modal}>

        <button className={style.modal__close} onClick={onClose}>
          <Icon icon="material-symbols:close-rounded" width="32" height="32" />
        </button>

        {children}

      </div>
    </div>,
    document.getElementById('modal-root')!
  )
}

export default ModalChildren