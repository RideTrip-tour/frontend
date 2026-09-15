import './variables.css'
import style from './switch.module.scss'

interface SwitchProps {
  checked: boolean
  onChange?: (value: boolean) => void
  disabled?: boolean
}

const Switch = ({ checked, onChange, disabled = false }: SwitchProps) => {
  const classes = [
    style.switch,
    checked ? style['switch--active'] : '',
    disabled ? style['switch--disabled'] : ''
  ].filter(Boolean).join(' ')

  const handleClick = () => {
    if (!disabled) onChange?.(!checked)
  }

  return (
    <button
      type="button"
      className={classes}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
    >
      <div className={style.switch__knob} />
    </button>
  )
}

export default Switch