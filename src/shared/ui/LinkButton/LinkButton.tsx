import type { AnchorHTMLAttributes, ReactNode } from 'react';

import style from './LinkButton.module.scss';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: ReactNode;
  variant?: 'shadow' | 'outline';
}

export function LinkButton({
  icon,
  variant = 'shadow',
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`${style.root} ${style[variant]} ${className}`}
      {...props}
    >
      {icon && <span className={style.icon}>{icon}</span>}
      {children}
    </a>
  );
}
