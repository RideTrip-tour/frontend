import type { ReactNode } from 'react';

import styles from './TripSection.module.scss';

interface TripSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  divider?: boolean;
}

export function TripSection({
  title,
  icon,
  children,
  className,
  divider = true,
}: Readonly<TripSectionProps>) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')}>
      <h2 className={styles.heading}>
        <span
          className={styles.icon}
          aria-hidden="true"
        >
          {icon}
        </span>
        {title}
      </h2>
      {divider && (
        <div
          className={styles.divider}
          aria-hidden="true"
        />
      )}
      {children}
    </section>
  );
}
