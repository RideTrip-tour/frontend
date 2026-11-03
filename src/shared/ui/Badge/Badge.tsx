import clsx from 'clsx';

import style from './badge.module.scss';

interface BadgeProps {
  text: string;
  className?: string;
}

export const Badge = ({ text, className = '' }: BadgeProps) => {
  return (
    <div className={clsx(style.badge, className)}>
      <span className={style.badge__text}>{text}</span>
    </div>
  );
};
