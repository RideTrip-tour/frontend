import './variables.css'
import style from './select.module.scss'
import { Icon } from '@iconify/react'

export interface Option {
  value: string
  label: string
}

export type SelectVariant = 'primary' | 'secondary'

export interface SelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: string
  isOpen?: boolean
  onToggle?: () => void
  variant?: SelectVariant
  label?: string
}

const Select = ({
                  options,
                  value,
                  onChange,
                  placeholder = 'Select...',
                  icon = 'iconamoon:arrow-right-2',
                  isOpen = false,
                  onToggle,
                  variant = 'primary',
                  label,
                }: SelectProps) => {

  const selected = options.find(o => o.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
  }

  const classes = [
    style.select,
    isOpen ? style['select--open'] : '',
    style[`select--${variant}`],
  ].filter(Boolean).join(' ')

  return (
    <div className={style.selectWrapper}>
      {label && <div className={style.selectLabel}>{label}</div>}
      <div className={classes}>
        <button
          type="button"
          className={style.select__trigger}
          onClick={() => onToggle?.()}
          aria-expanded={isOpen}
        >
          <div className={style.select__value}>
            {selected?.label || placeholder}
          </div>

          <Icon
            icon={icon}
            width="24"
            className={style.select__icon}
          />
        </button>

        {isOpen && (
          <div className={style.select__dropdown}>
            {options.map((opt, index) => (
              <button
                key={opt.value}
                type="button"
                className={style.select__option}
                onClick={() => handleSelect(opt.value)}
              >
                <div className={style.select__optionText}>
                  {opt.label}
                </div>

                {index !== options.length - 1 && (
                  <div className={style.select__divider}/>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Select
