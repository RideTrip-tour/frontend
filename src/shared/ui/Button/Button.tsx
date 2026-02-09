import style from './button.module.scss'
import './variables.css'
import type { MouseEventHandler } from 'react'

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  text?: string
  icon?: string
  variant?: 'action' | 'primary' | 'secondary'
  iconPosition?: 'left' | 'right'
  disabled?: boolean
}

export const Button = ({
                         text,
                         icon = '',
                         variant = 'action',
                         iconPosition = 'right',
                         onClick,
                         disabled = false
                       }: ButtonProps) => {
  const hasText = Boolean(text && text.trim().length > 0)
  const hasIcon = Boolean(icon && icon.trim().length > 0)

  const classes = [
    style.button,
    style[`button--${variant}`],
    icon && !hasText ? style['button--iconOnly'] : '',
    iconPosition === 'right' ? style['button--iconRight'] : ''
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
          <img
            src={icon}
            alt=""
            className={style.button__icon_img}
            aria-hidden
          />
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