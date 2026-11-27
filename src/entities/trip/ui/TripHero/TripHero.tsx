import clsx from 'clsx';
import { useId, type ReactNode } from 'react';

import {
  HotelIcon,
  LikeFilledIcon,
  LikeIcon,
  PeopleIcon,
  TaxiIcon,
} from '@/assets/icons/constructor';

import type { TripBadge } from '../../model/presentation';

import styles from './TripHero.module.scss';

interface TripHeaderContent {
  title: string;
  subtitle?: string;
  totalLabel: string;
  totalNote?: string;
  className?: string;
}

interface PlanHeader extends TripHeaderContent {
  variant?: 'plan';
  badges?: readonly TripBadge[];
  priceHeading?: string;
}

interface TourHeader extends TripHeaderContent {
  variant: 'tour';
  status?: ReactNode;
  rating?: ReactNode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BADGE_ICONS = {
  people: PeopleIcon,
  hotel: HotelIcon,
  transfer: TaxiIcon,
};

export function TripHero(props: Readonly<PlanHeader | TourHeader>) {
  const titleId = useId();
  const { title, subtitle, totalLabel, totalNote, className } = props;
  const isTour = props.variant === 'tour';
  const badges = isTour ? undefined : props.badges;

  return (
    <section
      className={clsx(styles.hero, isTour && styles.tour, className)}
      aria-labelledby={titleId}
    >
      {isTour && (
        <div className={styles.topRow}>
          {props.status}
          <button
            className={styles.favorite}
            type="button"
            aria-label={props.isFavorite ? 'Удалить тур из избранного' : 'Добавить тур в избранное'}
            aria-pressed={props.isFavorite}
            onClick={props.onToggleFavorite}
          >
            {props.isFavorite ? (
              <LikeFilledIcon aria-hidden="true" />
            ) : (
              <LikeIcon aria-hidden="true" />
            )}
          </button>
        </div>
      )}
      <div className={styles.details}>
        <h1 id={titleId}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {isTour && props.rating && <div className={styles.rating}>{props.rating}</div>}
        {badges && badges.length > 0 && (
          <ul
            className={styles.badges}
            aria-label="Параметры поездки"
          >
            {badges.map((badge) => {
              const BadgeIcon = BADGE_ICONS[badge.icon];
              return (
                <li
                  className={styles.badge}
                  key={`${badge.icon}-${badge.text}`}
                >
                  <BadgeIcon aria-hidden="true" />
                  {badge.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {isTour ? (
        <div className={styles.tourPrice}>
          <p className={styles.partnerNote}>
            Актуальные цены
            <br />
            на сайтах партнёров
          </p>
          <p className={styles.tourAmount}>
            <span>от</span> <strong className={styles.amount}>{totalLabel}</strong>
            {totalNote && <span>{totalNote}</span>}
          </p>
        </div>
      ) : (
        <div className={styles.price}>
          <p className={styles.priceHeading}>{props.priceHeading ?? 'Итоговая цена:'}</p>
          <p className={styles.amount}>{totalLabel}</p>
          {totalNote && <p className={styles.priceNote}>{totalNote}</p>}
        </div>
      )}
    </section>
  );
}
