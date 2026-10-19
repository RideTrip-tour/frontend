import { Icon } from '@iconify/react';
import type { MouseEventHandler } from 'react';

import style from './iconbutton.module.scss';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: string;
  variant?: 'primary' | 'secondary' | 'pagination';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const IconButton = ({
  icon = '',
  variant = 'primary',
  onClick,
  disabled = false,
  ariaLabel,
  className = '',
}: ButtonProps) => {
  const isIconify = /^[\w-]+:[\w-]+$/.test(icon ?? '');

  const classes = [
    style.iconbutton,
    style[`iconbutton--${variant}`],
    disabled ? style['iconbutton--disabled'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
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
  );
};
