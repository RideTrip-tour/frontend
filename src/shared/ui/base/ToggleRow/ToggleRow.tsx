import './variables.css'
import style from './togglerow.module.scss'
import Switch from '../Switch'

interface ToggleRowProps {
  label: string
  checked: boolean
  onChange?: (value: boolean) => void
}

const ToggleRow = ({ label, checked, onChange }: ToggleRowProps) => {
  return (
    <div className={style.togglerow}>
      <div className={style.togglerow__label}>
        {label}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
      />
    </div>
  )
}

export default ToggleRow