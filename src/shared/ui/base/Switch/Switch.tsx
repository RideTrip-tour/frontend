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
    <div
      className={classes}
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
    >
      <div className={style.switch__knob} />
    </div>
  )
}

export default Switch