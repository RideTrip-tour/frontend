import style from './button.module.scss'
import './variables.css'
import { Icon } from '@iconify/react'
import type { MouseEventHandler } from 'react'

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  text: string
  icon?: string
  variant?: 'primary' | 'secondary'
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  className?: string
}

export const Button = ({
                         text,
                         icon = '',
                         variant = 'primary',
                         iconPosition = 'right',
                         onClick,
                         disabled = false,
                         className = '',
                       }: ButtonProps) => {
  const hasText = Boolean(text && text.trim().length > 0)
  const hasIcon = Boolean(icon && icon.trim().length > 0)
  const isIconify = Boolean(icon?.includes(':'))

  const classes = [
    style.button,
    style[`button--${variant}`],
    hasIcon && hasText ? style['button--iconWithText'] : '',
    iconPosition === 'right' ? style['button--iconRight'] : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {hasIcon && (
        <div className={style.button__icon}>
          {isIconify ? (
            <Icon
              className={style.button__icon_img}
              icon={icon || ''}
            />
          ) : (
            <img
              src={icon}
              alt=""
              className={style.button__icon_img}
              aria-hidden
            />
          )}
        </div>
      )}

      {hasText && (
        <span className={style.button__text}>
          {text}
        </span>
      )}
    </button>
  )
}

export default Button