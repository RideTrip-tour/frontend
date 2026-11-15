import ConnectionErrorIcon from '@/assets/icons/partner-offers/ConnectionError.svg?react';
import { PartnerOfferCard, type PartnerOffer } from '@/entities/partner-offer';
import { EmptyState } from '@/shared/ui/base/EmptyState';

import type { PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOffersList.module.scss';

interface PartnerOffersListProps {
  offers: readonly PartnerOffer[];
  status: PartnerOffersStatus;
  favorites: ReadonlySet<string>;
  onFavoriteToggle: (offer: PartnerOffer) => void;
}

export function PartnerOffersList({
  offers,
  status,
  favorites,
  onFavoriteToggle,
}: PartnerOffersListProps) {
  if (status === 'error') {
    return (
      <div
        className={styles.errorContent}
        role="alert"
      >
        <EmptyState
          className={styles.serviceError}
          description="Попробуйте обновить через пару минут."
          icon={
            <ConnectionErrorIcon
              aria-hidden="true"
              className={styles.connectionIcon}
            />
          }
          title="Ой, кажется что-то сломалось"
        />
      </div>
    );
  }

  return (
    <div
      className={styles.resultsList}
      aria-live="polite"
    >
      {status === 'loading'
        ? Array.from({ length: 4 }, (_, index) => (
            <div
              aria-hidden="true"
              className={styles.loadingCard}
              key={index}
            />
          ))
        : offers.map((offer) => (
            <PartnerOfferCard
              isFavorite={favorites.has(offer.id)}
              key={offer.id}
              offer={offer}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))}
    </div>
  );
}
