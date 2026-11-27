import { Icon } from '@iconify/react';
import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

import {
  CalendarIcon,
  HotelIcon,
  MapMarkerIcon,
  MountainRoadIcon,
  PeopleIcon,
  SkilLevelIcon,
  TaxiIcon,
} from '@/assets/icons/constructor';
import {
  type ConstructorState,
  formatDestination,
  formatGuestSummary,
  formatSelectionSummary,
} from '@/widgets/travel-constructor';

import { formatDateRange, formatNightCount } from '../../lib/formatters';
import type { PartnerOffersStatus } from '../../model/types';

import styles from './PartnerOffersTripSummary.module.scss';

const UNSELECTED_LABEL = 'Не выбрано';
const SKI_LEVEL_ICON_CLASSES = new Map([
  ['новичок', styles.tripItemIconNovice],
  ['средний', styles.tripItemIconIntermediate],
  ['продвинутый', styles.tripItemIconAdvanced],
]);

type SummaryIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface TripSummaryItemProps {
  Icon: SummaryIcon;
  title: string;
  description: string;
  iconClassName?: string;
}

interface PartnerOffersTripSummaryProps {
  status: PartnerOffersStatus;
  trip: ConstructorState;
  onEdit: () => void;
  onOpenPlan: () => void;
  selectedAccommodationName?: string;
}

function TripSummaryItem({
  Icon,
  title,
  description,
  iconClassName,
}: Readonly<TripSummaryItemProps>) {
  return (
    <div className={styles.tripItem}>
      <Icon
        aria-hidden="true"
        className={clsx(styles.tripItemIcon, iconClassName)}
      />
      <span className={styles.tripItemTitle}>{title}</span>
      <span className={styles.tripItemDescription}>{description}</span>
    </div>
  );
}

export function PartnerOffersTripSummary({
  status,
  trip,
  onEdit,
  onOpenPlan,
  selectedAccommodationName,
}: Readonly<PartnerOffersTripSummaryProps>) {
  if (status === 'error') return null;

  const {
    toCity,
    toCountry,
    selectedResort,
    departureDate,
    returnDate,
    activities,
    liftTypes,
    people,
    level,
    accommodation,
    transfer,
  } = trip;
  const destination = formatDestination({ selectedResort, toCity, toCountry });
  const activityLabel = formatSelectionSummary([...activities, ...liftTypes]);
  const levelIconClass = SKI_LEVEL_ICON_CLASSES.get(level?.trim().toLocaleLowerCase('ru-RU') ?? '');

  return (
    <section className={styles.trip}>
      <div className={styles.tripHeader}>
        <h2>Ваше путешествие</h2>
        <div className={styles.tripActions}>
          <button
            className={styles.editButton}
            onClick={onEdit}
            type="button"
          >
            Изменить параметры
            <Icon
              aria-hidden="true"
              className={styles.buttonIcon}
              height={24}
              icon="solar:pen-bold"
              width={24}
            />
          </button>
          <button
            className={styles.planButton}
            onClick={onOpenPlan}
            type="button"
          >
            План поездки
            <Icon
              aria-hidden="true"
              className={styles.buttonIcon}
              height={20}
              icon="material-symbols:arrow-forward-rounded"
              width={20}
            />
          </button>
        </div>
      </div>
      <div className={styles.tripItems}>
        <TripSummaryItem
          Icon={MapMarkerIcon}
          description="Направление"
          title={destination ?? UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={CalendarIcon}
          description={formatNightCount(departureDate, returnDate) ?? 'Даты поездки'}
          title={formatDateRange(departureDate, returnDate) ?? UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={MountainRoadIcon}
          description="Активность"
          title={activityLabel ?? UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={SkilLevelIcon}
          description="Уровень катания"
          iconClassName={levelIconClass}
          title={level ?? UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={PeopleIcon}
          description="Состав группы"
          title={people ? formatGuestSummary(people) : UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={HotelIcon}
          description="Проживание"
          title={selectedAccommodationName ?? accommodation?.name ?? UNSELECTED_LABEL}
        />
        <TripSummaryItem
          Icon={TaxiIcon}
          description="Трансфер"
          title={transfer?.label ?? UNSELECTED_LABEL}
        />
      </div>
      {trip.tourPackage && (
        <p>
          При выборе другого отеля пакет «{trip.tourPackage.title}» и его допуслуги будут сняты.
          Конструктор пересчитает поездку по отдельным услугам.
        </p>
      )}
    </section>
  );
}
