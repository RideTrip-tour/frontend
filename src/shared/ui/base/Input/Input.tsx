import './variables.css'
import style from './input.module.scss'
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'

interface InputProps {
  onSubmit: (value: string) => void
  validate?: (value: string) => boolean
  onChange?: (value: string) => void
  debounce?: number
  icon?: string
  autoSubmit?: boolean
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  errorMessage?: string
  value?: string
  defaultValue?: string
  id?: string
  name?: string
  label?: string
  'aria-label'?: string
  'aria-describedby'?: string
  maxLength?: number
}

const Input = ({
                 validate,
                 onSubmit,
                 onChange,
                 debounce = 1500,
                 icon,
                 autoSubmit = false,
                 disabled = false,
                 readOnly = false,
                 placeholder = "Введите текст...",
                 errorMessage,
                 value,
                 defaultValue,
                 id,
                 name,
                 label,
                 'aria-label': ariaLabel,
                 'aria-describedby': ariaDescribedBy,
                 maxLength
               }: InputProps) => {

  const isControlled = value !== undefined

  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [isValid, setIsValid] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const inputValue = isControlled ? value : internalValue

  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceTimeoutRef = useRef<number | null>(null)

  const handleWrapperClick = () => {
    if (!disabled && !readOnly) {
      inputRef.current?.focus()
    }
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

    if (!isControlled) {
      setInternalValue(newValue)
    }

    onChange?.(newValue)
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
    if (disabled && debounceTimeoutRef.current) {
      window.clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
  }, [disabled])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const classes = [
    style.input,
    isFocused ? style['input--focus'] : '',
    !isValid ? style['input--invalid'] : '',
    disabled ? style['input--disabled'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={style.inputWrapper}>

      {label && (
        <label htmlFor={id} className={style.inputLabel}>
          {label}
        </label>
      )}

      {!isValid && errorMessage && (
        <div className={style.inputError}>
          {errorMessage}
        </div>
      )}

      <div className={classes} onClick={handleWrapperClick}>

        <div className={style.input__content}>

          {icon && (
            <span className={style.input__icon}>
              <img src={icon} className={style.input__icon_img} alt="icon" />
            </span>
          )}

          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            className={style.input__field}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!isValid}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            placeholder={placeholder}
          />

        </div>

      </div>

    </div>
  )
}

export default Input