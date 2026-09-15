import style from './checkbox.module.scss'
import './variables.css'

interface CheckboxProps {
  checked: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
  'aria-label'?: string
}

const Checkbox = ({
  checked,
  disabled = false,
  onChange,
  'aria-label': ariaLabel = 'Выбрать',
}: Readonly<CheckboxProps>) => {
  return (
    <label className={style.checkbox} data-disabled={disabled}>
      <input
        type="checkbox"
        className={style.checkbox__input}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={event => onChange?.(event.currentTarget.checked)}
      />
      <span className={style.checkbox__box} aria-hidden="true">
        {checked && (
          <svg
            aria-hidden="true"
            focusable="false"
            width="22"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 13L9.12698 17L18 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </label>
  )
}

export default Checkbox
