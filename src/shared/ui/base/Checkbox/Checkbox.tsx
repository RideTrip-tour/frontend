import style from './checkbox.module.scss'
import './variables.css'

interface CheckboxProps {
  checked: boolean
  onChange?: (value: boolean) => void
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <div
      className={style.checkbox}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
    >
      <div className={style.checkbox__box}>
        {checked && (
          <svg
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
      </div>
    </div>
  )
}

export default Checkbox