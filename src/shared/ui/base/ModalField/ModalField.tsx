import style from './modalfield.module.scss'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

export type ModalFieldStatus = 'default' | 'focus' | 'success' | 'error'

interface ModalFieldProps {
  id?: string
  name?: string
  type?: 'text' | 'email' | 'password' | 'tel'
  label: string
  value: string
  placeholder?: string
  status?: ModalFieldStatus
  hint?: string
  hintTone?: 'default' | 'success' | 'error'
  showToggle?: boolean
  isPasswordVisible?: boolean
  autoComplete?: string
  onToggleVisibility?: () => void
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  isLast: boolean
}

const ModalField = ({
  id,
  name,
  type = 'text',
  label,
  value,
  placeholder = '',
  status = 'default',
  hint,
  hintTone = 'default',
  showToggle = false,
  isPasswordVisible = false,
  autoComplete,
  onToggleVisibility,
  onChange,
  onFocus,
  onBlur,
  isLast
}: ModalFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [autofillActive, setAutofillActive] = useState(false)

  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type

  const isFloating = value.length > 0 || status === 'focus' || autofillActive

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleInput = () => {
      const nv = input.value
      if (nv) setAutofillActive(false)
      if (nv !== value) onChange(nv)
    }

    input.addEventListener('input', handleInput)
    return () => input.removeEventListener('input', handleInput)
  }, [value, onChange])

  return (
    <div className={`${style.fieldGroup} ${isLast ? style.lastFieldGroup : ''}`}>
      <div
        className={`${style.inputWrapper} ${
          status === 'focus'
            ? style.focus
            : status === 'success'
              ? style.success
              : status === 'error'
                ? style.error
                : style.default
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={inputType}
          className={style.input}
          autoComplete={autoComplete}
          placeholder={isFloating ? '' : placeholder}
          onAnimationStart={(e) => {
            if (e.animationName.includes('autofill')) {
              setAutofillActive(true)
            }
          }}
          onChange={(e) => {
            setAutofillActive(false)
            onChange(e.target.value)
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <label
          htmlFor={inputId}
          className={`${style.floatingLabel} ${isFloating ? style.floating : ''} ${
            status === 'success' ? style.labelSuccess : status === 'error' ? style.labelError : ''
          }`}
        >
          {label}
        </label>

        {showToggle && (
          <button
            type="button"
            className={style.eyeButton}
            onClick={onToggleVisibility}
            aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {isPasswordVisible ? (
              <Icon icon="mdi:eye" width="24" height="24" />
            ) : (
              <Icon icon="mdi:eye-off" width="24" height="24" />
            )}
          </button>
        )}
      </div>

      {hint && (
        <p
          className={`${style.hint} ${style.visible} ${
            hintTone === 'error'
              ? style.hintError
              : hintTone === 'success'
                ? style.hintSuccess
                : ''
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

export default ModalField
