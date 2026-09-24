import style from './iconbutton.module.scss'
import './variables.css'
import {Icon} from '@iconify/react'
import type {MouseEventHandler} from 'react'

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  icon: string
  variant?: 'primary' | 'secondary' | 'pagination'
  disabled?: boolean
}

export const IconButton = ({
                             icon = '',
                             variant = 'primary',
                             onClick,
                             disabled = false
                           }: ButtonProps) => {
  const isIconify = Boolean(icon?.includes(':'))

  const classes = [
    style.iconbutton,
    style[`iconbutton--${variant}`],
    disabled ? style['iconbutton--disabled'] : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={style.iconbutton__icon}>
        {isIconify ? (
          <Icon
            className={style.iconbutton__icon_img}
            icon={icon || ''}
          />
        ) : (
          <img
            src={icon}
            alt=""
            className={style.iconbutton__icon_img}
            aria-hidden
          />
        )}
      </div>
    </button>
  )
}

export default IconButton