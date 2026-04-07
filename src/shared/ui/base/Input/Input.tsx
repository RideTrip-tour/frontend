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
  debounce?: number
  icon?: string
  autoSubmit?: boolean
  disabled?: boolean
  placeholder?: string
  errorMessage?: string
}

const Input = ({
                 validate,
                 onSubmit,
                 debounce = 1500,
                 icon,
                 autoSubmit = false,
                 disabled = false,
                 placeholder = "Введите текст...",
                 errorMessage
               }: InputProps) => {

  const [inputValue, setInputValue] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceTimeoutRef = useRef<number | null>(null)

  const handleWrapperClick = () => {
    if (!disabled) {
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

      {!isValid && errorMessage && (
        <div className={style.inputError}>
          {errorMessage}
        </div>
      )}

      <div className={classes} onClick={handleWrapperClick}>

        <div className={style.input__content}>

          {icon && (
            <span className={style.input__icon}>
              <img src={icon} className={style.input__icon_img} alt="icon"/>
            </span>
          )}

          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            className={style.input__field}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={!isValid}
            placeholder={placeholder}
          />

        </div>

      </div>

    </div>
  )
}

export default Input