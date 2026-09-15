import { Icon } from '@iconify/react'
import style from './modalchildren.module.scss'
import './variables.css'
import type { ReactNode } from 'react';
import ModalOverlay from '@/shared/ui/base/ModalOverlay'

interface ModalChildrenProps {
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
}

const ModalChildren = ({ onClose, children, ariaLabel = 'Модальное окно' }: Readonly<ModalChildrenProps>) => {
  return (
    <ModalOverlay
      className={style.overlay}
      onClose={onClose}
      ariaLabel={ariaLabel}
    >
      <div className={style.modal}>

        <button type="button" aria-label="Закрыть модальное окно" className={style.modal__close} onClick={onClose}>
          <Icon icon="material-symbols:close-rounded" width="32" height="32" />
        </button>

        {children}

      </div>
    </ModalOverlay>
  )
}

export default ModalChildren