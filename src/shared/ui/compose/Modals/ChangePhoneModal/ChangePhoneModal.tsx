import { useEffect, useState, type FormEvent } from 'react'
import ModalShell from '@/shared/ui/base/ModalShell'
import ModalForm from '@/shared/ui/base/ModalForm'
import ModalButton from '@/shared/ui/base/ModalButton'
import Input from '@/shared/ui/base/Input/Input.tsx'

interface ChangePhoneModalProps {
  isOpen: boolean
  currentPhone: string
  isLoading?: boolean
  serverError?: string
  onClose: () => void
  onSubmit: (phone: string) => void | Promise<void>
}

const isPhoneValid = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (!/^[0-9+\s()-]+$/.test(trimmed)) return false
  return trimmed.replace(/\D/g, '').length >= 10
}

const ChangePhoneModal = ({
  isOpen,
  currentPhone,
  isLoading = false,
  serverError = '',
  onClose,
  onSubmit
}: ChangePhoneModalProps) => {
  const [phone, setPhone] = useState(currentPhone)

  useEffect(() => {
    if (isOpen) setPhone(currentPhone)
  }, [isOpen, currentPhone])

  const valid = isPhoneValid(phone)
  const trimmed = phone.trim()
  const isActive = !isLoading && valid

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isActive) return
    onSubmit(trimmed)
  }

  return (
    <ModalShell isOpen={isOpen} title="Изменить номер телефона" onClose={onClose}>
      <ModalForm onSubmit={handleSubmit} serverError={serverError}>
        <Input
          id="change-phone"
          label="Номер телефона"
          value={phone}
          onChange={setPhone}
          onSubmit={() => {
            if (isActive) onSubmit(trimmed)
          }}
          validate={isPhoneValid}
          placeholder="+7 (900) 000-00-00"
          debounce={0}
          autoSubmit={false}
        />

        <ModalButton
          text="Сохранить"
          isLoading={isLoading}
          isActive={isActive}
        />
      </ModalForm>
    </ModalShell>
  )
}

export default ChangePhoneModal
