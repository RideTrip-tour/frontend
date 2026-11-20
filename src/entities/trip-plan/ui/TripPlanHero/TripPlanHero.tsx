import { useId } from 'react';

import { HotelIcon, PeopleIcon, TaxiIcon } from '@/assets/icons/constructor';

import type { TripPlanBadge } from '../../model/presentation';

import styles from './TripPlanHero.module.scss';

export interface TripPlanHeroProps {
  title: string;
  subtitle?: string;
  badges?: readonly TripPlanBadge[];
  totalLabel: string;
  totalNote?: string;
  priceHeading?: string;
  className?: string;
}

const BADGE_ICONS = {
  people: PeopleIcon,
  hotel: HotelIcon,
  transfer: TaxiIcon,
};

export function TripPlanHero({
  title,
  subtitle,
  badges = [],
  totalLabel,
  totalNote,
  priceHeading = 'Итоговая цена:',
  className,
}: TripPlanHeroProps) {
  const titleId = useId();

  return (
    <section
      className={[styles.hero, className].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className={styles.details}>
        <h1 id={titleId}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {badges.length > 0 && (
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
      <div className={styles.price}>
        <p className={styles.priceHeading}>{priceHeading}</p>
        <p className={styles.amount}>{totalLabel}</p>
        {totalNote && <p className={styles.priceNote}>{totalNote}</p>}
      </div>
    </section>
  );
}
