import './variables.css'
import style from './modal.module.scss'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className={style.modal__overlay}>
      <div className={style.modal__content}>
        {title && <h2 className={style.modal__title}>{title}</h2>}
        <div className={style.modal__body}>
          {children}
        </div>
        <button className={style.modal__close} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}

export default Modal
