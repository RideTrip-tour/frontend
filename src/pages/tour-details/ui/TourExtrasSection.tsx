import { PlusIcon } from '@/assets/icons/constructor';
import type { TourAddonId, TourAddonOffer } from '@/entities/tour';
import { TripSection } from '@/entities/trip';
import { formatPrice } from '@/widgets/travel-constructor/lib/formatters';

import styles from './TourDetailsPage.module.scss';

interface TourExtrasSectionProps {
  offers: readonly TourAddonOffer[];
  quantities: Partial<Record<TourAddonId, number>>;
  onAdd: (id: TourAddonId) => void;
}

export function TourExtrasSection({ offers, quantities, onAdd }: Readonly<TourExtrasSectionProps>) {
  return (
    <TripSection
      title="Добавить к туру"
      icon={<PlusIcon className={styles.plusIcon} />}
    >
      <ul className={styles.offers}>
        {offers.map((offer) => {
          const added = (quantities[offer.id] ?? 0) > 0;
          return (
            <li
              key={offer.id}
              className={styles.offer}
            >
              <span>{offer.label}</span>
              <span className={styles.rate}>
                от{' '}
                <strong>
                  {formatPrice(offer.unitPrice)}/{offer.unit === 'day' ? 'день' : 'час'}
                </strong>
              </span>
              <button
                type="button"
                className={styles.add}
                aria-label={`${added ? 'Добавлено' : 'Добавить'}: ${offer.label}`}
                disabled={added}
                onClick={() => onAdd(offer.id)}
              >
                {added ? 'Добавлено' : 'Добавить'}
              </button>
            </li>
          );
        })}
      </ul>
    </TripSection>
  );
}
