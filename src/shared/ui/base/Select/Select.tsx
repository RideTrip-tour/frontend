import './variables.css'
import style from './select.module.scss'
import { Icon } from '@iconify/react'

export interface Option {
  value: string
  label: string
}

export interface SelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: string
  isOpen?: boolean
  onToggle?: () => void
}

const Select = ({
                  options,
                  value,
                  onChange,
                  placeholder = 'Select...',
                  icon = 'iconamoon:arrow-right-2',
                  isOpen = false,
                  onToggle,
                }: SelectProps) => {

  const selected = options.find(o => o.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
    onToggle?.()
  }

  const classes = [
    style.select,
    isOpen ? style['select--open'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div
        className={style.select__trigger}
        onClick={() => onToggle?.()}
      >
        <div className={style.select__value}>
          {selected?.label || placeholder}
        </div>

        <Icon
          icon={icon}
          width="24"
          className={style.select__icon}
        />
      </div>

      {isOpen && (
        <div className={style.select__dropdown}>
          {options.map((opt, index) => (
            <div
              key={opt.value}
              className={style.select__option}
              onClick={() => handleSelect(opt.value)}
            >
              <div className={style.select__optionText}>
                {opt.label}
              </div>

              {index !== options.length - 1 && (
                <div className={style.select__divider}/>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select