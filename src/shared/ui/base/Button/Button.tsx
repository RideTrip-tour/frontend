import style from './button.module.scss'
import './variables.css'
import { Icon } from '@iconify/react'
import type { MouseEventHandler, ReactNode } from 'react'

export interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  text: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary'
  iconVariant?: 'default' | 'plain'
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  className?: string
}

export const Button = ({
  text,
  icon,
  variant = 'primary',
  iconVariant = 'default',
  iconPosition = 'right',
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) => {
  const hasText = Boolean(text && text.trim().length > 0)
  const hasIcon =
    typeof icon === 'string' ? icon.trim().length > 0 : Boolean(icon)

  const classes = [
    style.button,
    style[`button--${variant}`],
    iconVariant === 'plain' ? style['button--iconPlain'] : '',
    hasIcon && hasText ? style['button--iconWithText'] : '',
    iconPosition === 'right' ? style['button--iconRight'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const renderIcon = () => {
    if (!hasIcon) {
      return null
    }

    // Если передали React-компонент:
    // icon={<PlusIcon />}
    if (typeof icon !== 'string') {
      return icon
    }

    // Если передали строку Iconify:
    // icon="mdi:plus"
    if (icon.includes(':')) {
      return (
        <Icon
          className={style.button__icon_img}
          icon={icon}
          aria-hidden="true"
        />
      )
    }

    // Если передали путь к SVG/изображению:
    return (
      <img
        src={icon}
        alt=""
        className={style.button__icon_img}
        aria-hidden
      />
    )
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {hasIcon && (
        <div className={style.button__icon}>
          {renderIcon()}
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