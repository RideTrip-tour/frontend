import clsx from 'clsx';

import { HotelIcon, MountainRoadIcon, PeopleIcon, TaxiIcon } from '@/assets/icons/constructor';
import { Button } from '@/shared/ui/Button';
import { TourCardStatus, type TourStatus } from '@/shared/ui/compose/TourCardStatus';

import style from './tourcard.module.scss';

export interface TourCardProps {
  imageSrc: string;
  destination: string;
  dates: string;
  duration: string;
  status: TourStatus;
  activities: Array<{ label: string }>;
  guests: string;
  accommodation: string;
  transfer?: string;
  priceLine: { value?: string; caption: string };
  onShare?: () => void;
  onPlan?: () => void;
  onRepeat?: () => void;
  onBooking?: () => void;
  onEdit?: () => void;
}

const statusConfig: Record<TourStatus, string> = {
  active: 'Активный',
  archive: 'Архив',
  booking: 'Ожидает бронирования',
  process: 'В процессе',
};

const TourCard = ({
  imageSrc,
  destination,
  dates,
  duration,
  status,
  activities,
  guests,
  accommodation,
  transfer,
  priceLine,
  onShare,
  onPlan,
  onRepeat,
  onBooking,
  onEdit,
}: TourCardProps) => {
  const statusLabel = statusConfig[status];

  return (
    <article className={clsx(style.tourcard, style[`tourcard--${status}`])}>
      <div className={style.tourcard__body}>
        <img
          src={imageSrc}
          alt={destination}
          className={style.tourcard__image}
        />

        <div className={style.tourcard__content}>
          <div className={style.tourcard__info}>
            <div className={style.tourcard__top}>
              <div className={style.tourcard__heading}>
                <div className={style.tourcard__title}>{destination}</div>
                <div className={style.tourcard__meta}>
                  <span>{dates}</span>
                  <i
                    className={style.tourcard__dot}
                    aria-hidden="true"
                  />
                  <span>{duration}</span>
                </div>
              </div>
              <TourCardStatus
                text={statusLabel}
                status={status}
              />
            </div>

            <div className={style.tourcard__details}>
              {activities.map((activity) => (
                <div
                  key={activity.label}
                  className={style.tourcard__detail}
                >
                  <MountainRoadIcon className={style.tourcard__detailIcon} />
                  <span>{activity.label}</span>
                </div>
              ))}
              <div className={style.tourcard__detail}>
                <PeopleIcon className={style.tourcard__detailIcon} />
                <span>{guests}</span>
              </div>
              <div className={style.tourcard__detail}>
                <HotelIcon className={style.tourcard__detailIcon} />
                <span>{accommodation}</span>
              </div>
              {transfer && (
                <div className={style.tourcard__detail}>
                  <TaxiIcon className={style.tourcard__detailIcon} />
                  <span>{transfer}</span>
                </div>
              )}
            </div>
          </div>

          <div className={style.tourcard__footer}>
            <div className={style.tourcard__price}>
              {priceLine.value ? (
                <span className={style.tourcard__priceValue}>{priceLine.value}</span>
              ) : (
                <span className={style.tourcard__priceValue}>{'—'}</span>
              )}
              <span className={style.tourcard__priceCaption}>{priceLine.caption}</span>
            </div>

            <div className={style.tourcard__actions}>
              {status === 'active' && onShare && (
                <Button
                  variant="outline"
                  text="Поделиться"
                  onClick={onShare}
                />
              )}
              {status === 'active' && onPlan && (
                <Button
                  variant="accent"
                  text="План поездки"
                  onClick={onPlan}
                  icon="material-symbols:arrow-forward-rounded"
                  iconPosition="right"
                />
              )}
              {status === 'archive' && onRepeat && (
                <Button
                  variant="outline"
                  text="Повторить поездку"
                  onClick={onRepeat}
                />
              )}
              {status === 'booking' && onEdit && (
                <Button
                  variant="outline"
                  text="Изменить"
                  onClick={onEdit}
                />
              )}
              {status === 'booking' && onBooking && (
                <Button
                  variant="accent"
                  text="К бронированию"
                  onClick={onBooking}
                  icon="material-symbols:arrow-forward-rounded"
                  iconPosition="right"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TourCard;
