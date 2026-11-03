import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

import { GalleryIcon } from '@/assets/icons';
import {
  CalendarIcon,
  HotelIcon,
  MountainRoadIcon,
  RoadFinishIcon,
} from '@/assets/icons/constructor';
import { Button } from '@/shared/ui/Button';
import { TourCardStatus } from '@/shared/ui/compose/TourCardStatus';

import style from './drafttourcard.module.scss';

export type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type DraftTourDetail =
  { city: string } | { date: string } | { activity: string } | { hotel: string };

export interface DraftTourCardProps {
  imageSrc?: string;
  imagePlaceholderIcon?: SvgIconComponent;
  destination?: string;
  createdAt?: string;
  statusText?: string;
  progress?: number;
  progressText?: string;
  details?: DraftTourDetail[];
  hints?: string;
  onDelete?: () => void;
  onContinue?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const renderDetailIcon = (detail: DraftTourDetail) => {
  if ('city' in detail) return <RoadFinishIcon className={style.tourcard__detailIcon} />;
  if ('date' in detail) return <CalendarIcon className={style.tourcard__detailIcon} />;
  if ('activity' in detail) return <MountainRoadIcon className={style.tourcard__detailIcon} />;
  return <HotelIcon className={style.tourcard__detailIcon} />;
};

const getDetailLabel = (detail: DraftTourDetail) => {
  if ('city' in detail) return detail.city;
  if ('date' in detail) return detail.date;
  if ('activity' in detail) return detail.activity;
  return detail.hotel;
};

const DraftTourCard = ({
  imageSrc,
  imagePlaceholderIcon: PlaceholderIcon = GalleryIcon,
  destination = '',
  createdAt = '',
  statusText = '',
  progress = 0,
  progressText = '',
  details = [],
  hints = '',
  onDelete,
  onContinue,
  isEmpty = false,
  emptyTitle = 'Вы пока еще не добавили туры',
  emptyDescription = '',
}: DraftTourCardProps) => {
  if (isEmpty) {
    return (
      <article className={clsx(style['tourcard--draft'])}>
        <div className={style.tourcard__empty}>
          <h3 className={style.tourcard__emptyTitle}>{emptyTitle}</h3>
          {emptyDescription && (
            <p className={style.tourcard__emptyDescription}>{emptyDescription}</p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={clsx(style.tourcard, style['tourcard--draft'])}>
      <div className={style.tourcard__body}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={destination}
            className={style.tourcard__image}
          />
        ) : (
          <div className={style.tourcard__placeholder}>
            <PlaceholderIcon className={style.tourcard__placeholderIcon} />
          </div>
        )}

        <div className={style.tourcard__content}>
          <div className={style.tourcard__top}>
            <div className={style.tourcard__heading}>
              <div className={style.tourcard__title}>{destination}</div>
              <div className={style.tourcard__meta}>
                <span>{createdAt}</span>
                <i
                  className={style.tourcard__dot}
                  aria-hidden="true"
                />
                <span>{statusText}</span>
              </div>
            </div>
            <TourCardStatus
              text="В процессе"
              status="process"
            />
          </div>

          <div className={style.tourcard__progress}>
            <div className={style.tourcard__progressTrack}>
              <div
                className={style.tourcard__progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={style.tourcard__progressText}>{progressText}</div>
          </div>

          <div className={style.tourcard__details}>
            {details.map((detail) => (
              <div
                key={getDetailLabel(detail)}
                className={style.tourcard__detail}
              >
                {renderDetailIcon(detail)}
                <span>{getDetailLabel(detail)}</span>
              </div>
            ))}
          </div>

          <div className={style.tourcard__hints}>
            <span className={style.tourcard__hintsTitle}>{'Уточните детали: '}</span>
            <span>{hints}</span>
          </div>

          <div className={style.tourcard__footer}>
            <div className={style.tourcard__price}>
              <span className={style.tourcard__priceValue}>{'—'}</span>
              <span className={style.tourcard__priceCaption}>
                {'цена появится после всех выбранных параметров'}
              </span>
            </div>

            <div className={style.tourcard__actions}>
              {onDelete && (
                <Button
                  variant="outline"
                  text="Удалить"
                  onClick={onDelete}
                />
              )}
              {onContinue && (
                <Button
                  variant="accent"
                  text="Продолжить"
                  onClick={onContinue}
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

export default DraftTourCard;
