import './variables.css'
import style from './input.module.scss'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

interface InputProps {
  onSubmit: (value: string) => void
  validate?: (value: string) => boolean
  debounce?: number
  icon?: string
  variant?: 'primary' | 'secondary'
  autoSubmit?: boolean
}

const Input = ({
                 validate,
                 onSubmit,
                 debounce = 1500,
                 icon,
                 variant = 'primary',
                 autoSubmit = false
               }: InputProps) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isValid, setIsValid] = useState(true)
  const debounceTimeoutRef = useRef<number | null>(null)

  const handleWrapperClick = () => {
    inputRef.current?.focus()
  }

  const defaultValidate = (value: string) => {
    if (value === '') return true
    try {
      return /^[\p{L}0-9\s,.?-]+$/u.test(value)
    } catch {
      return /^[A-Za-zА-Яа-я0-9\s,.?-]+$/.test(value)
    }
  }

  const runValidation = (value: string) => {
    const isDefaultValid = defaultValidate(value)
    const isCustomValid = typeof validate === 'function' ? validate(value) : true
    const valid = isDefaultValid && isCustomValid
    setIsValid(valid)
    return valid
  }

  const scheduleDebouncedSubmit = (value: string) => {
    if (debounceTimeoutRef.current) {
      window.clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    if (!debounce || debounce <= 0) return

    debounceTimeoutRef.current = window.setTimeout(() => {
      if (value && value.length > 0) {
        if (runValidation(value)) {
          onSubmit(value)
        }
      }
      debounceTimeoutRef.current = null
    }, debounce)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)

    runValidation(newValue)

    if (autoSubmit && debounce && debounce > 0) {
      scheduleDebouncedSubmit(newValue)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }
      if (runValidation(inputValue)) {
        onSubmit(inputValue)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }
    }
  }, [])

  const classes = [
    style.input,
    style[`input--${variant}`],
    !isValid ? style['input--invalid'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={handleWrapperClick}>
      {icon && (
        <span className={style.input__icon} aria-hidden>
          <img src={icon} className={style.input__icon_img} alt="icon" />
        </span>
      )}

      <input
        type="text"
        ref={inputRef}
        className={style.input__field}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-invalid={!isValid}
        aria-label="input"
        placeholder="Введите текст..."
      />
    </div>
  )
}

export default Input
