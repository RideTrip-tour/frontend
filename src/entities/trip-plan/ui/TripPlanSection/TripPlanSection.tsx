import type { ReactNode } from 'react';

import styles from './TripPlanSection.module.scss';

export interface TripPlanSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function TripPlanSection({
  title,
  icon,
  children,
  className,
}: Readonly<TripPlanSectionProps>) {
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
      <div
        className={styles.divider}
        aria-hidden="true"
      />
      {children}
    </section>
  );
}
