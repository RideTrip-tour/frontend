import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

import styles from './FiltersToolbar.module.scss';

export interface FiltersToolbarProps {
  children: ReactNode;
  sortControl?: ReactNode;
  className?: string;
}

export function FiltersToolbar({
  children,
  sortControl,
  className,
}: Readonly<FiltersToolbarProps>) {
  return (
    <div className={clsx(styles.toolbar, className)}>
      <div className={styles.filterGroup}>{children}</div>
      {sortControl}
    </div>
  );
}

export interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
}

export function FilterButton({
  children,
  className,
  type = 'button',
  variant = 'default',
  ...props
}: Readonly<FilterButtonProps>) {
  return (
    <button
      {...props}
      className={clsx(styles.control, variant === 'primary' && styles.primary, className)}
      type={type}
    >
      {children}
    </button>
  );
}

export type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function FilterSelect({ children, className, ...props }: Readonly<FilterSelectProps>) {
  return (
    <select
      {...props}
      className={clsx(styles.control, styles.select, className)}
    >
      {children}
    </select>
  );
}

export type SortSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SortSelect({ children, className, ...props }: Readonly<SortSelectProps>) {
  return (
    <select
      {...props}
      className={clsx(styles.control, styles.select, styles.sortSelect, className)}
    >
      {children}
    </select>
  );
}
