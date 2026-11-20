import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './CardList.module.scss';

export interface CardListProps {
  children: ReactNode;
  className?: string;
}

export function CardList({ children, className }: Readonly<CardListProps>) {
  return (
    <div
      aria-live="polite"
      className={clsx(styles.list, className)}
    >
      {children}
    </div>
  );
}
