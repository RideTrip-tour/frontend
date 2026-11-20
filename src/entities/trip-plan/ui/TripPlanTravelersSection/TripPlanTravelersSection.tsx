import { Icon } from '@iconify/react';

import { PeopleIcon } from '@/assets/icons/constructor';

import type { TripPlanTraveler } from '../../model/presentation';
import { TripPlanSection } from '../TripPlanSection/TripPlanSection';

import styles from './TripPlanTravelersSection.module.scss';

export interface TripPlanTravelersSectionProps {
  travelers: readonly TripPlanTraveler[];
  additional?: readonly string[];
  onEdit?: () => void;
}

export function TripPlanTravelersSection({
  travelers,
  additional,
  onEdit,
}: Readonly<TripPlanTravelersSectionProps>) {
  return (
    <TripPlanSection
      title="Состав поездки"
      icon={<PeopleIcon />}
    >
      {travelers.length > 0 ? (
        <ul className={styles.travelers}>
          {travelers.map((traveler) => (
            <li
              className={styles.traveler}
              key={traveler.id}
            >
              <span
                className={styles.icon}
                aria-hidden="true"
              >
                <Icon icon={traveler.isChild ? 'mingcute:baby-fill' : 'fa6-solid:user'} />
              </span>
              <div>
                <p className={styles.title}>{traveler.label}</p>
                {traveler.description && <p className={styles.note}>{traveler.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>Участники пока не добавлены</p>
          {onEdit && (
            <button
              type="button"
              className={styles.edit}
              onClick={onEdit}
            >
              Указать состав группы
            </button>
          )}
        </div>
      )}
      {additional && additional.length > 0 && (
        <div className={styles.additional}>
          <h3>Пожелания к поездке</h3>
          <ul className={styles.tags}>
            {additional.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </div>
      )}
    </TripPlanSection>
  );
}
