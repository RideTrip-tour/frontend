import { useId, type ReactNode } from 'react';

import ModalOverlay from '@/shared/ui/base/ModalOverlay';
import { Button } from '@/shared/ui/Button';

import type { Resort } from '../../model/types';
import { ResortDetailsIcon, type ResortDetailsIconName } from './ResortDetailsIcon';

import styles from './ResortDetailsModal.module.scss';

interface ResortDetailsModalProps {
  resort: Resort | null;
  isSelected: boolean;
  onClose: () => void;
  onSelect: (resort: Resort) => void;
}

const numberFormatter = new Intl.NumberFormat('ru-RU');
const ratingFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const reviewPluralRules = new Intl.PluralRules('ru-RU');
const reviewWords: Record<string, string> = { one: 'отзыв', few: 'отзыва', many: 'отзывов' };
const trailTypes = [
  { key: 'green', label: 'Зелёные (новички)' },
  { key: 'blue', label: 'Синие (средние)' },
  { key: 'red', label: 'Красные (продвинутые)' },
  { key: 'black', label: 'Чёрные (экстремальные)' },
] as const;

function InfoRow({ icon, children }: { icon: ResortDetailsIconName; children: ReactNode }) {
  return (
    <li className={styles.infoRow}>
      <ResortDetailsIcon
        name={icon}
        className={styles.infoIcon}
      />
      <span>{children}</span>
    </li>
  );
}

export function ResortDetailsModal({
  resort,
  isSelected,
  onClose,
  onSelect,
}: ResortDetailsModalProps) {
  const titleId = useId();
  if (!resort) return null;

  const { details } = resort;
  const location = resort.location
    .toLocaleLowerCase('ru-RU')
    .includes(resort.country.toLocaleLowerCase('ru-RU'))
    ? resort.location
    : `${resort.location}, ${resort.country}`;
  const reviewWord = reviewWords[reviewPluralRules.select(resort.reviewsCount)] ?? 'отзывов';

  const selectResort = () => {
    if (!resort.isOpen || isSelected) return;
    onSelect(resort);
    onClose();
  };

  return (
    <ModalOverlay
      variant="dimmed"
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <div className={styles.modal}>
        <div className={styles.closeRow}>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
            aria-label="Закрыть подробную информацию о курорте"
          >
            <ResortDetailsIcon name="close" />
          </button>
        </div>

        <header className={styles.summary}>
          <div className={styles.headingRow}>
            <h2
              className={styles.title}
              id={titleId}
            >
              {resort.name}
            </h2>
            <p className={styles.rating}>
              <ResortDetailsIcon
                name="star"
                className={styles.star}
              />
              <span aria-label={`Рейтинг ${ratingFormatter.format(resort.rating)} из 5`}>
                {ratingFormatter.format(resort.rating)}
              </span>
              <span
                className={styles.ratingDivider}
                aria-hidden="true"
              >
                |
              </span>
              <span>
                {numberFormatter.format(resort.reviewsCount)} {reviewWord}
              </span>
            </p>
          </div>
          <p className={styles.location}>{location}</p>
          <p className={styles.description}>{resort.description}</p>
          <span
            className={`${styles.status} ${resort.isOpen ? styles.openStatus : styles.closedStatus}`}
          >
            <span
              className={styles.statusDot}
              aria-hidden="true"
            />
            {resort.isOpen
              ? `Открыто | ${resort.openTrails}/${resort.totalTrails} трасс`
              : 'Закрыто | сезон окончен'}
          </span>
        </header>

        <div className={styles.detailsRow}>
          <section
            className={styles.section}
            aria-labelledby={`${titleId}-trails`}
          >
            <h3
              className={styles.sectionTitle}
              id={`${titleId}-trails`}
            >
              Трассы
            </h3>
            <ul className={styles.trails}>
              {trailTypes.map(({ key, label }) => (
                <li
                  className={styles.trailRow}
                  key={key}
                >
                  <span
                    className={`${styles.trailDot} ${styles[key]}`}
                    aria-hidden="true"
                  />
                  <span>
                    {label} — {details.trailCounts[key]}
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.elevation}>
              <ResortDetailsIcon
                name="elevation"
                className={styles.infoIcon}
              />
              Высота: {numberFormatter.format(resort.minElevation)}–
              {numberFormatter.format(resort.maxElevation)} м
            </p>
          </section>
          <section
            className={styles.section}
            aria-labelledby={`${titleId}-lifts`}
          >
            <h3
              className={styles.sectionTitle}
              id={`${titleId}-lifts`}
            >
              Подъёмники
            </h3>
            <ul className={styles.infoList}>
              <InfoRow icon="gondola">Гондольные — {details.lifts.gondola}</InfoRow>
              <InfoRow icon="chairlift">Кресельные — {details.lifts.chair}</InfoRow>
              <InfoRow icon="surface-lift">Бугельные — {details.lifts.surface}</InfoRow>
              <InfoRow icon="snowpark">Сноупарк — {details.hasSnowpark ? 'есть' : 'нет'}</InfoRow>
              <InfoRow icon="freeride">
                Зоны фрирайда — {details.hasFreeride ? 'есть' : 'нет'}
              </InfoRow>
            </ul>
          </section>
        </div>

        <div className={styles.detailsRow}>
          <section
            className={styles.section}
            aria-labelledby={`${titleId}-prices`}
          >
            <h3
              className={styles.sectionTitle}
              id={`${titleId}-prices`}
            >
              Стоимость
            </h3>
            <dl className={styles.prices}>
              <div>
                <dt>Ски-пасс (1 день)</dt>
                <dd>
                  от <strong>{numberFormatter.format(resort.pricePerDay)} ₽/день</strong>
                </dd>
              </div>
              <div>
                <dt>Прокат снаряжения</dt>
                <dd>
                  от <strong>{numberFormatter.format(details.rentalPricePerDay)} ₽/день</strong>
                </dd>
              </div>
              <div>
                <dt>Инструктор (за час)</dt>
                <dd>
                  от <strong>{numberFormatter.format(details.instructorPricePerHour)} ₽/час</strong>
                </dd>
              </div>
            </dl>
          </section>
          <section
            className={styles.section}
            aria-labelledby={`${titleId}-infrastructure`}
          >
            <h3
              className={styles.sectionTitle}
              id={`${titleId}-infrastructure`}
            >
              Инфраструктура
            </h3>
            <ul className={styles.infoList}>
              <InfoRow icon="family">
                Подходит:{' '}
                {details.suitableFor.map((item) => item.toLocaleLowerCase('ru-RU')).join(', ')}
              </InfoRow>
              <InfoRow icon="parking">Парковка — {details.hasParking ? 'есть' : 'нет'}</InfoRow>
              {details.airport && (
                <InfoRow icon="airport">
                  До аэропорта ({details.airport.name}):{' '}
                  {numberFormatter.format(details.airport.distanceKm)} км
                </InfoRow>
              )}
            </ul>
            <h4 className={styles.amenitiesTitle}>Apres-ski</h4>
            <ul className={styles.amenities}>
              {resort.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>
        </div>

        <footer className={styles.footer}>
          <p className={styles.hint}>
            {!resort.isOpen
              ? 'Курорт сейчас недоступен для выбора'
              : isSelected
                ? 'Курорт уже добавлен в конструктор'
                : 'Нажмите «Выбрать», чтобы добавить курорт в конструктор'}
          </p>
          <div className={styles.actions}>
            <Button
              className={`${styles.action} ${styles.closeAction}`}
              text="Закрыть"
              variant="light"
              onClick={onClose}
            />
            <Button
              className={`${styles.action} ${styles.selectAction}`}
              disabled={!resort.isOpen || isSelected}
              text={!resort.isOpen ? 'Недоступен' : isSelected ? 'Выбран' : 'Выбрать'}
              icon={
                <ResortDetailsIcon
                  name="arrow"
                  className={styles.actionArrow}
                />
              }
              iconVariant="plain"
              variant="solid"
              onClick={selectResort}
            />
          </div>
        </footer>
      </div>
    </ModalOverlay>
  );
}
