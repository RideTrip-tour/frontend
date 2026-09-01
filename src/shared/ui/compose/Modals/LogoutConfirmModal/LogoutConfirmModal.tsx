import style from './logoutconfirmmodal.module.scss'
import ModalShell from '@/shared/ui/base/ModalShell'
import ModalButton from '@/shared/ui/base/ModalButton'
import ModalForm from '@/shared/ui/base/ModalForm'
import type { FormEvent } from 'react'

interface LogoutConfirmModalProps {
  isOpen: boolean
  isLoading?: boolean
  serverError?: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

const LogoutConfirmModal = ({
  isOpen,
  isLoading = false,
  serverError = '',
  onClose,
  onConfirm
}: LogoutConfirmModalProps) => {
  const isActive = !isLoading

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isActive) return
    onConfirm()
  }

  return (
    <ModalShell isOpen={isOpen} title="Выйти из аккаунта?" onClose={onClose}>
      <ModalForm onSubmit={handleSubmit} serverError={serverError}>
        <p className={style.logoutconfirmmodal__text}>
          Вы сможете снова войти в любое время.
        </p>

        <div className={style.logoutconfirmmodal__actions}>
          <button
            type="button"
            className={style.logoutconfirmmodal__btn}
            onClick={onClose}
            disabled={isLoading}
          >
            Нет
          </button>
          <ModalButton
            text="Да"
            isLoading={isLoading}
            isActive={isActive}
          />
        </div>
      </ModalForm>
    </ModalShell>
  )
}

export default LogoutConfirmModal
