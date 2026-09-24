import style from './modalform.module.scss'
import type { FormEvent, ReactNode } from 'react'

interface ModalFormProps {
  onSubmit: (e: FormEvent) => void
  children: ReactNode
  serverError?: string
}

const ModalForm = ({ onSubmit, children, serverError = '' }: ModalFormProps) => {
  return (
    <form className={style.form} onSubmit={onSubmit}>
      <div className={style.form__body}>
        {children}
      </div>
      {serverError && <p className={style.centerError}>{serverError}</p>}
    </form>
  )
}

export default ModalForm
