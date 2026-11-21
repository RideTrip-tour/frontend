import { Icon } from '@iconify/react';
import clsx from 'clsx';
import {
  forwardRef,
  type MouseEventHandler,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

import style from './iconbutton.module.scss';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: string;
  variant?: 'primary' | 'secondary' | 'pagination';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  iconClassName?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: 'menu' | 'dialog' | 'grid' | 'listbox' | 'tree' | 'true' | 'false';
}

const IconButtonComponent = (
  {
    icon = '',
    variant = 'primary',
    onClick,
    disabled = false,
    ariaLabel,
    className = '',
    iconClassName = '',
    ariaExpanded,
    ariaHasPopup,
  }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) => {
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
      ref={ref}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
    >
      <div className={style.iconbutton__icon}>
        {isIconify ? (
          <Icon
            className={clsx(style.iconbutton__icon_img, iconClassName)}
            icon={icon || ''}
          />
        ) : (
          <img
            src={icon}
            alt=""
            className={clsx(style.iconbutton__icon_img, iconClassName)}
            aria-hidden
          />
        )}
      </div>
    </button>
  );
};

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  IconButtonComponent,
) as ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;
IconButton.displayName = 'IconButton';
