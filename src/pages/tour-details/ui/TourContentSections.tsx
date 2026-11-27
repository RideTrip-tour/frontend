import type { ReactNode } from 'react';

import { HotelIcon, MountainRoadIcon, PlainIcon, TaxiIcon } from '@/assets/icons/constructor';
import { ResortDetailsIcon, ResortTrailBreakdown, type Resort } from '@/entities/resort';
import type { TourOverview } from '@/entities/tour/model/details';
import type { TourReview } from '@/entities/tour/model/reviews';
import { TripSection } from '@/entities/trip';
import ReviewBigCard from '@/shared/ui/compose/ReviewBigCard';
import { SkillsLevel } from '@/shared/ui/SkillsLevel';
import ReviewSlider from '@/widgets/reviews/ui/ReviewSlider';

import styles from './TourContentSections.module.scss';

const includedIcons: Record<TourOverview['included'][number]['icon'], ReactNode> = {
  flight: <PlainIcon />,
  hotel: <HotelIcon />,
  pass: <ResortDetailsIcon name="pass" />,
  transfer: <TaxiIcon viewBox="0 0 54 54" />,
  rental: <ResortDetailsIcon name="rental" />,
};

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm1-14a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3h2v6h-2z"
      />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4 3h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8l-6 3V5a2 2 0 0 1 2-2Zm4 11 .6-2.8L15 4.9l2.1 2.2-6.3 6.3L8 14Zm5 .5h4v1.3h-4z"
      />
    </svg>
  );
}

function Tags({ title, entries }: Readonly<{ title: string; entries?: readonly string[] }>) {
  if (!entries?.length) return null;
  return (
    <div className={styles.block}>
      <h3>{title}</h3>
      <ul className={styles.tags}>
        {entries.map((entry) => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}

export function TourOverviewSection({ overview }: Readonly<{ overview: TourOverview }>) {
  return (
    <TripSection
      title="О туре"
      icon={<InfoIcon />}
      divider={false}
      className={styles.section}
    >
      <p className={styles.description}>{overview.description.join('\n')}</p>
      <dl className={styles.facts}>
        <div>
          <dt>Уровень катания</dt>
          <dd>
            <SkillsLevel
              level={overview.level}
              label={overview.levelLabel}
            />
          </dd>
        </div>
        <div>
          <dt>Длительность</dt>
          <dd>{overview.duration}</dd>
          <dd className={styles.note}>{overview.datesLabel}</dd>
        </div>
        <div>
          <dt>Состав</dt>
          <dd>{overview.groupLabel}</dd>
          {overview.ageLabel && <dd className={styles.note}>{overview.ageLabel}</dd>}
        </div>
      </dl>
      {overview.included.length > 0 && (
        <div className={styles.block}>
          <h3>Что включено</h3>
          <ul className={styles.included}>
            {overview.included.map(({ id, icon, text }) => (
              <li key={id}>
                {includedIcons[icon]}
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {overview.audience.length > 0 && (
        <div className={styles.block}>
          <h3>Кому подойдёт</h3>
          <ul className={styles.audience}>
            {overview.audience.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      )}
    </TripSection>
  );
}

const numberFormatter = new Intl.NumberFormat('ru-RU');
const pluralRules = new Intl.PluralRules('ru-RU');
const trailWords: Record<string, string> = { one: 'трасса', few: 'трассы', many: 'трасс' };

export function ResortTrailSection({ resort }: Readonly<{ resort: Resort }>) {
  const { details } = resort;
  const features = [
    details.hasFreeride && 'Зоны фрирайда',
    details.hasSnowpark && 'Сноупарк',
    details.hasNightSkiing && 'Ночное катание',
  ].filter((item): item is string => typeof item === 'string');
  return (
    <TripSection
      title="Трассы"
      icon={<MountainRoadIcon viewBox="0 0 54 54" />}
      className={styles.section}
    >
      <dl className={styles.facts}>
        <div>
          <dt>Всего трасс</dt>
          <dd>
            <strong>
              {numberFormatter.format(resort.totalTrails)}{' '}
              {trailWords[pluralRules.select(resort.totalTrails)] ?? 'трасс'}
            </strong>
            {details.trailLengthKm != null &&
              ` • ${numberFormatter.format(details.trailLengthKm)} км`}
          </dd>
        </div>
        <div>
          <dt>Высота</dt>
          <dd>
            {numberFormatter.format(resort.minElevation)} –{' '}
            {numberFormatter.format(resort.maxElevation)} м
          </dd>
        </div>
      </dl>
      <div className={styles.block}>
        <ResortTrailBreakdown counts={details.trailCounts} />
      </div>
      <Tags
        title="Дополнительно"
        entries={features}
      />
      {(details.airport || details.directions) && (
        <p className={styles.directions}>
          <strong>Как добраться:</strong>{' '}
          {details.airport &&
            `Аэропорт ${details.airport.name}, около ${details.airport.distanceKm} км. `}
          {details.directions}
        </p>
      )}
    </TripSection>
  );
}

export function ResortInfrastructureSection({ resort }: Readonly<{ resort: Resort }>) {
  const { details } = resort;
  const facilities = [
    { icon: 'gondola', label: 'Гондольные', value: details.lifts.gondola },
    { icon: 'chairlift', label: 'Кресельные', value: details.lifts.chair },
    { icon: 'surface-lift', label: 'Бугельные', value: details.lifts.surface },
    { icon: 'rental', label: 'Пункты проката', value: details.rentalLocations },
    { icon: 'instructor', label: 'Служба инструкторов', value: details.hasInstructors },
    { icon: 'rescue', label: 'Служба спасения', value: details.hasRescueService },
    { icon: 'locker', label: 'Камеры хранения', value: details.hasLockers },
    { icon: 'parking', label: 'Парковка', value: details.hasParking },
  ] as const;
  return (
    <TripSection
      title="Инфраструктура"
      icon={<HotelIcon />}
      className={styles.section}
    >
      <ul className={styles.facilities}>
        {facilities
          .filter(({ value }) => value != null)
          .map(({ icon, label, value }) => (
            <li key={icon}>
              <ResortDetailsIcon name={icon} />
              {label} — {typeof value === 'boolean' ? (value ? 'есть' : 'нет') : value}
            </li>
          ))}
      </ul>
      <Tags
        title="Доступность"
        entries={details.accessibility}
      />
      <Tags
        title="Дополнительные развлечения"
        entries={resort.amenities}
      />
    </TripSection>
  );
}

export function TourReviewsSection({ reviews }: Readonly<{ reviews?: readonly TourReview[] }>) {
  if (!reviews?.length) return null;
  return (
    <TripSection
      title="Отзывы"
      icon={<ReviewIcon />}
      className={styles.section}
    >
      <ReviewSlider
        edgePadding={0}
        items={reviews.map((review) => (
          <ReviewBigCard
            key={review.id}
            {...review}
          />
        ))}
      />
    </TripSection>
  );
}
