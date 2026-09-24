import style from './deleteaccountmodal.module.scss'
import React, { useState } from 'react'
import ModalShell from '@/shared/ui/base/ModalShell'
import ModalButton from '@/shared/ui/base/ModalButton'
import ModalForm from '@/shared/ui/base/ModalForm'
import type { FormEvent } from 'react'

interface DeleteAccountModalProps {
  isOpen: boolean
  expectedEmail: string
  isLoading?: boolean
  serverError?: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

const DeleteAccountModal = ({
  isOpen,
  expectedEmail,
  isLoading = false,
  serverError = '',
  onClose,
  onConfirm
}: DeleteAccountModalProps) => {
  const [typed, setTyped] = useState('')

  const matches = typed.trim().toLowerCase() === expectedEmail.trim().toLowerCase()
  const isActive = matches && !isLoading

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTyped(e.target.value)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isActive) return
    onConfirm()
  }

  return (
    <ModalShell isOpen={isOpen} title="Удалить аккаунт" onClose={onClose}>
      <ModalForm onSubmit={handleSubmit} serverError={serverError}>
        <p className={style.deleteaccountmodal__warning}>
          Данное действие нельзя будет отменить.
          Аккаунт будет удалён навсегда.
        </p>

        <div className={style.deleteaccountmodal__field}>
          <label
            htmlFor="delete-account-email"
            className={style.deleteaccountmodal__label}
          >
            Введите ваш email для подтверждения
          </label>
          <input
            id="delete-account-email"
            type="email"
            className={style.deleteaccountmodal__input}
            value={typed}
            onChange={handleChange}
            onPaste={handlePaste}
            onDrop={(e) => e.preventDefault()}
            placeholder={expectedEmail}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <span className={style.deleteaccountmodal__hint}>
            Введите: {expectedEmail}
          </span>
        </div>

        <ModalButton
          text="Удалить аккаунт"
          isLoading={isLoading}
          isActive={isActive}
        />
      </ModalForm>
    </ModalShell>
  )
}

export default DeleteAccountModal
