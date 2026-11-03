import type { CSSProperties, HTMLAttributes } from 'react';

import style from './statuspill.module.scss';

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  backgroundColor?: string;
  color?: string;
}

export const StatusPill = ({
  text,
  backgroundColor,
  color,
  className = '',
  ...rest
}: StatusPillProps) => (
  <span
    {...rest}
    className={className ? `${style.statuspill} ${className}` : style.statuspill}
    style={{ backgroundColor, color } as CSSProperties}
  >
    {text}
  </span>
);

export default StatusPill;
