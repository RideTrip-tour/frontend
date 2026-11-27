import { Icon } from '@iconify/react';
import clsx from 'clsx';

import type { Resort, ResortDetails } from '../model/types';

import styles from './ResortFacts.module.scss';

const numberFormatter = new Intl.NumberFormat('ru-RU');
const plurals = new Intl.PluralRules('ru-RU');
const reviewWords: Record<string, string> = { one: 'отзыв', few: 'отзыва', many: 'отзывов' };
const trailTypes = [
  { key: 'green', label: 'Зелёные (новички)' },
  { key: 'blue', label: 'Синие (средние)' },
  { key: 'red', label: 'Красные (продвинутые)' },
  { key: 'black', label: 'Чёрные (экстремальные)' },
] as const;

export function ResortStatus({
  resort,
  className,
}: Readonly<{
  resort: Pick<Resort, 'isOpen' | 'openTrails' | 'totalTrails'>;
  className?: string;
}>) {
  return (
    <span className={clsx(styles.status, !resort.isOpen && styles.closed, className)}>
      <span
        aria-hidden="true"
        className={styles.dot}
      />
      {resort.isOpen
        ? `Открыто | ${resort.openTrails}/${resort.totalTrails} трасс`
        : 'Закрыто | сезон окончен'}
    </span>
  );
}

export function ResortRating({
  resort,
}: Readonly<{ resort: Pick<Resort, 'rating' | 'reviewsCount'> }>) {
  const word = reviewWords[plurals.select(resort.reviewsCount)] ?? 'отзывов';
  return (
    <p className={styles.rating}>
      <Icon
        icon="material-symbols:star-rounded"
        className={styles.star}
        aria-hidden="true"
      />
      <span
        className={styles.ratingValue}
        aria-label={`Рейтинг ${numberFormatter.format(resort.rating)} из 5`}
      >
        {numberFormatter.format(resort.rating)}
      </span>
      <span className={styles.reviewCount}>
        {numberFormatter.format(resort.reviewsCount)} {word}
      </span>
    </p>
  );
}

export function ResortTrailBreakdown({
  counts,
}: Readonly<{ counts: ResortDetails['trailCounts'] }>) {
  return (
    <ul className={styles.trails}>
      {trailTypes.map(({ key, label }) => (
        <li key={key}>
          <span
            aria-hidden="true"
            className={clsx(styles.trailDot, styles[key])}
          />
          {label} — {counts[key]}
        </li>
      ))}
    </ul>
  );
}
