import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import style from './modalchildren.module.scss'
import './variables.css'
import type { ReactNode } from 'react'

interface ModalChildrenProps {
  onClose: () => void
  children: ReactNode
}

const ModalChildren = ({ onClose, children }: ModalChildrenProps) => {
  return createPortal(
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={event => event.stopPropagation()}>

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