import clsx from 'clsx';
import { useId } from 'react';

import type { Resort, TrailDifficulty } from '../../model/types';

import styles from './ResortCard.module.scss';

const numberFormatter = new Intl.NumberFormat('ru-RU');
const ratingFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const difficulties: readonly TrailDifficulty[] = ['green', 'blue', 'red', 'black'];
const difficultyLabels: Record<TrailDifficulty, string> = {
  green: 'учебные',
  blue: 'простые',
  red: 'средней сложности',
  black: 'сложные',
};

function formatReviews(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  const word =
    lastTwoDigits >= 11 && lastTwoDigits <= 14
      ? 'отзывов'
      : lastDigit === 1
        ? 'отзыв'
        : lastDigit >= 2 && lastDigit <= 4
          ? 'отзыва'
          : 'отзывов';

  return `${numberFormatter.format(count)} ${word}`;
}

interface ResortCardProps {
  resort: Resort;
  variant?: 'default' | 'compact';
  isSelected?: boolean;
  onSelect: (resort: Resort) => void;
  onDetails: (resort: Resort) => void;
}

export function ResortCard({
  resort,
  variant = 'default',
  isSelected = false,
  onSelect,
  onDetails,
}: Readonly<ResortCardProps>) {
  const titleId = useId();
  const isCompact = variant === 'compact';

  return (
    <article
      aria-labelledby={titleId}
      className={clsx(
        styles.card,
        isCompact && styles.compact,
        isSelected && styles.selected,
        !resort.isOpen && styles.closed,
      )}
    >
      <div className={styles.imageWrapper}>
        <img
          alt={resort.imageAlt}
          className={styles.image}
          loading="lazy"
          src={resort.image}
        />
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headingRow}>
            <h2
              className={styles.title}
              id={titleId}
            >
              {resort.name}
            </h2>
            <p className={styles.rating}>
              <span
                aria-hidden="true"
                className={styles.star}
              >
                ★
              </span>
              <span aria-label={`Рейтинг ${ratingFormatter.format(resort.rating)} из 5`}>
                {ratingFormatter.format(resort.rating)}
              </span>
              <span
                aria-hidden="true"
                className={styles.ratingDivider}
              >
                |
              </span>
              <span className={styles.reviewCount}>{formatReviews(resort.reviewsCount)}</span>
            </p>
          </div>
          <p className={styles.location}>{resort.location}</p>
        </header>

        <div className={styles.conditions}>
          <div className={styles.trails}>
            <span className={styles.trailsLabel}>Трассы:</span>
            <span
              aria-label={`Уровни трасс: ${resort.difficulties.map((item) => difficultyLabels[item]).join(', ')}`}
              className={styles.difficulties}
              role="img"
            >
              {difficulties.map((difficulty) => (
                <span
                  aria-hidden="true"
                  className={clsx(
                    styles.difficulty,
                    resort.difficulties.includes(difficulty) && styles[difficulty],
                  )}
                  key={difficulty}
                />
              ))}
            </span>
          </div>
          <span
            className={clsx(styles.status, resort.isOpen ? styles.openStatus : styles.closedStatus)}
          >
            <span aria-hidden="true">•</span>
            {resort.isOpen
              ? `Открыто | ${resort.openTrails}/${resort.totalTrails} трасс`
              : 'Закрыто | сезон окончен'}
          </span>
          {!isCompact && (
            <span className={styles.elevation}>
              <svg
                aria-hidden="true"
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
              >
                <path
                  d="M10 2.5v15M6.5 6 10 2.5 13.5 6M6.5 14l3.5 3.5 3.5-3.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              Высота: {numberFormatter.format(resort.minElevation)} -{' '}
              {numberFormatter.format(resort.maxElevation)} м
            </span>
          )}
        </div>

        {!isCompact && (
          <ul
            aria-label="Инфраструктура курорта"
            className={styles.amenities}
          >
            {resort.amenities.map((amenity) => (
              <li
                className={styles.amenity}
                key={amenity}
              >
                {amenity}
              </li>
            ))}
          </ul>
        )}

        <footer className={styles.footer}>
          <p className={styles.price}>
            <span>Ски-пасс от:</span>
            <strong>{numberFormatter.format(resort.pricePerDay)} ₽</strong>
            <span>/день</span>
          </p>
          <div className={styles.actions}>
            <button
              aria-label={`Подробнее о курорте ${resort.name}`}
              className={clsx(styles.action, styles.detailsButton)}
              onClick={() => onDetails(resort)}
              type="button"
            >
              Подробнее
            </button>
            <button
              aria-label={
                !resort.isOpen
                  ? `Курорт ${resort.name} недоступен`
                  : isSelected
                    ? `Курорт ${resort.name} выбран`
                    : `Выбрать курорт ${resort.name}`
              }
              aria-pressed={isSelected}
              className={clsx(styles.action, styles.selectButton)}
              disabled={!resort.isOpen}
              onClick={() => onSelect(resort)}
              type="button"
            >
              {!resort.isOpen ? 'Недоступен' : isSelected ? 'Выбран' : 'Выбрать'}
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
