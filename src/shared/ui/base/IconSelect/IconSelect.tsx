import './variables.css'
import style from './iconselect.module.scss'
import { useState } from 'react'
import { Icon } from '@iconify/react'

interface Option {
  value: string
  label: string
}

interface IconSelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder: string
  text: string
  icon: string
  iconColor?: string
  iconBg?: string
}

const IconSelect = ({
                      options,
                      value,
                      onChange,
                      placeholder = 'Select...',
                      text,
                      icon,
                      iconColor = 'var(--Dark-blue, #1E4D8F)',
                      iconBg = 'rgba(30, 77, 143, 0.10)'
                    }: IconSelectProps) => {

  const [isOpen, setIsOpen] = useState(false)

  const selected = options.find(o => o.value === value)

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  const classes = [
    style.iconselect,
    isOpen ? style['iconselect--open'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>

      <div
        className={style.iconselect__trigger}
        onClick={() => setIsOpen(prev => !prev)}
      >

        <div
          className={style.iconselect__iconWrap}
          style={{ backgroundColor: iconBg }}
        >
          <Icon
            icon={icon}
            width="24"
            style={{ color: iconColor }}
          />
        </div>

        <div className={style.iconselect__content}>
          <div className={style.iconselect__label}>
            <span className={style.iconselect__labelText}>
              {text}
            </span>
            <Icon
              icon="iconamoon:arrow-down-2"
              width="20"
              className={style.iconselect__arrow}
            />
          </div>

          <span className={style.iconselect__value}>
            {selected?.label || placeholder}
          </span>
        </div>

      </div>

      {isOpen && (
        <div className={style.iconselect__dropdown}>
          {options.map((opt, index) => (
            <div
              key={opt.value}
              className={style.iconselect__option}
              onClick={() => handleSelect(opt.value)}
            >
              <div className={style.iconselect__optionText}>
                {opt.label}
              </div>

              {index !== options.length - 1 && (
                <div className={style.iconselect__divider} />
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default IconSelect