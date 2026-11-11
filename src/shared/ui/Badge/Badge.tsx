import clsx from 'clsx';

import style from './badge.module.scss';

interface BadgeProps {
  text: string;
  tone?: 'info' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = ({ text, tone = 'info', size = 'md', className }: BadgeProps) => {
  return (
    <span
      className={clsx(
        style.badge,
        style[`badge--${tone}`],
        size === 'sm' && style['badge--sm'],
        className,
      )}
    >
      <span className={style.badge__text}>{text}</span>
    </span>
  );
};
