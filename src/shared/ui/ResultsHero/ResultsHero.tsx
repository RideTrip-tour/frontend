import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './ResultsHero.module.scss';

export interface ResultsHeroProps {
  id: string;
  title: ReactNode;
  count?: ReactNode;
  description?: ReactNode;
  image: string;
  imageAlt: string;
  className?: string;
  variant?: 'default' | 'error';
}

export function ResultsHero({
  id,
  title,
  count,
  description,
  image,
  imageAlt,
  className,
  variant = 'default',
}: Readonly<ResultsHeroProps>) {
  const hasDescription = description !== undefined && description !== null;
  const hasCount = count !== undefined && count !== null;

  return (
    <section
      aria-describedby={hasDescription ? `${id}-description` : undefined}
      aria-labelledby={`${id}-title`}
      className={clsx(styles.hero, variant === 'error' && styles.heroError, className)}
    >
      <div className={styles.heroCopy}>
        <h1
          className={styles.heroTitle}
          id={`${id}-title`}
        >
          {title}
          {hasCount && (
            <>
              {' '}
              <span className={styles.heroCount}>{count}</span>
            </>
          )}
        </h1>
        {hasDescription && (
          <p
            className={styles.heroDescription}
            id={`${id}-description`}
          >
            {description}
          </p>
        )}
      </div>
      <img
        alt={imageAlt}
        className={styles.heroImage}
        src={image}
      />
    </section>
  );
}
