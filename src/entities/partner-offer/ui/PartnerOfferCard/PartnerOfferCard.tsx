import clsx from 'clsx';
import { useId, useState } from 'react';

import { ArrowRightIcon, LikeFilledIcon, LikeIcon } from '@/assets/icons/constructor';
import { Badge } from '@/shared/ui/Badge';

import type { PartnerOffer } from '../../model/types';

import styles from './PartnerOfferCard.module.scss';

const priceFormatter = new Intl.NumberFormat('ru-RU');

interface PartnerOfferCardProps {
  offer: PartnerOffer;
  isFavorite?: boolean;
  isSelected?: boolean;
  onSelect?: (offer: PartnerOffer) => void;
  onFavoriteToggle?: (offer: PartnerOffer) => void;
}

export function PartnerOfferCard({
  offer,
  isFavorite: controlledFavorite,
  isSelected = false,
  onSelect,
  onFavoriteToggle,
}: Readonly<PartnerOfferCardProps>) {
  const titleId = useId();
  const [localFavorite, setLocalFavorite] = useState(false);
  const isFavorite = controlledFavorite ?? localFavorite;
  const recommendation =
    offer.recommendation ??
    (offer.featured ? { label: 'Лучший выбор', tone: 'success' as const } : null);

  const toggleFavorite = () => {
    if (controlledFavorite === undefined) {
      setLocalFavorite((value) => !value);
    }
    onFavoriteToggle?.(offer);
  };

  return (
    <article
      aria-labelledby={titleId}
      className={styles.card}
      tabIndex={0}
    >
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img
            alt={offer.imageAlt}
            className={styles.image}
            src={offer.image}
          />
          <button
            aria-label={
              isFavorite
                ? `Удалить ${offer.name} из избранного`
                : `Добавить ${offer.name} в избранное`
            }
            aria-pressed={isFavorite}
            className={clsx(styles.favoriteButton, isFavorite && styles.favoriteButtonActive)}
            onClick={toggleFavorite}
            type="button"
          >
            {isFavorite ? <LikeFilledIcon /> : <LikeIcon />}
          </button>
        </div>

        <div className={styles.description}>
          <header className={styles.header}>
            <div className={styles.headingRow}>
              <div className={styles.titleLine}>
                <h3
                  className={styles.cardTitle}
                  id={titleId}
                >
                  {offer.name}
                </h3>
                {recommendation && (
                  <Badge
                    size="sm"
                    text={recommendation.label}
                    tone={recommendation.tone}
                  />
                )}
              </div>
              <p className={styles.rating}>
                <span
                  aria-hidden="true"
                  className={styles.star}
                >
                  ★
                </span>
                <strong>{offer.rating.toFixed(1)}</strong>
                <span className={styles.ratingDivider}>|</span>
                <span className={styles.count}>{offer.reviews} отзывов</span>
              </p>
            </div>
            <p className={styles.location}>{offer.location}</p>
          </header>
          <div className={styles.body}>
            {offer.badges.map((badge) => (
              <span
                className={styles.badge}
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
          <footer className={styles.footer}>
            <div className={styles.price}>
              <span>от</span>
              <strong>{priceFormatter.format(offer.price)} ₽</strong>
              <small>{offer.priceLabel}</small>
            </div>
            <div className={styles.providerAndAction}>
              <img
                alt={offer.provider}
                className={styles.providerLogo}
                src={offer.providerLogo}
              />
              <button
                className={styles.selectButton}
                disabled={isSelected}
                onClick={() => onSelect?.(offer)}
                type="button"
              >
                {isSelected ? 'Добавлено в план' : 'Добавить в план'}
                <ArrowRightIcon aria-hidden="true" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
