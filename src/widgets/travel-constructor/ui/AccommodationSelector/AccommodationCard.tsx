import { useState } from 'react';
import clsx from 'clsx';
import type { AccommodationOption } from '@/entities/accommodation';
import { priceFormatter } from '@/widgets/travel-constructor/lib/formatters';
import { LikeIcon, LikeFilledIcon } from '@/assets/icons/constructor';
import styles from './AccommodationSelector.module.scss';

interface AccommodationCardProps {
  option: AccommodationOption;
  isSelected: boolean;
  onSelect: (option: AccommodationOption) => void;
}

export function AccommodationCard({
  option,
  isSelected,
  onSelect,
}: AccommodationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article
      className={clsx(styles.card, {
        [styles.cardSelected]: isSelected,
      })}
    >
      <div className={styles.imageWrapper}>
        <img
          alt={option.imageAlt}
          className={styles.image}
          src={option.image}
        />

        <button
          aria-label={
            isFavorite
              ? `Удалить ${option.name} из избранного`
              : `Добавить ${option.name} в избранное`
          }
          aria-pressed={isFavorite}
          className={clsx(styles.favoriteButton, {
            [styles.favoriteButtonActive]: isFavorite,
          })}
          onClick={() => setIsFavorite((prev) => !prev)}
          type="button"
        >
          {isFavorite ? <LikeFilledIcon /> : <LikeIcon />}
        </button>
      </div>

      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>
          {option.name}

          <p className={styles.rating}>
            <span aria-hidden="true" className={styles.star}>
              ★
            </span>
            <strong>{option.rating.toFixed(2)}</strong>
            <span className={styles.count}>
              {option.reviews} отзывов
            </span>
          </p>
        </h4>

        <p className={styles.location}>{option.location}</p>

        <div className={styles.badges}>
          {option.badges.map((badge) => (
            <span className={styles.badge} key={badge}>
              {badge}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            <span>от</span>
            <strong>
              {priceFormatter.format(option.pricePerNight)} ₽
            </strong>
          </div>

          <button
            aria-pressed={isSelected}
            className={clsx(styles.selectButton, {
              [styles.selectButtonSelected]: isSelected,
            })}
            onClick={() => onSelect(option)}
            type="button"
          >
            {isSelected ? 'Выбрано' : 'Выбрать'}
          </button>
        </div>
      </div>
    </article>
  );
}