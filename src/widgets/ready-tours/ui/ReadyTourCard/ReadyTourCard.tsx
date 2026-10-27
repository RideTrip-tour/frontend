import { Icon } from '@iconify/react';

import { Button } from '@/shared/ui/Button';
import { READY_TOUR_ACTIVITY_ICONS, type ReadyTourPreset } from '@/widgets/ready-tours/model';

import style from './readytourcard.module.scss';

export interface ReadyTourCardProps {
  tour: ReadyTourPreset;
  onApply?: (tour: ReadyTourPreset) => void;
}

const formatPrice = (price: number) => price.toLocaleString('ru-RU');

const selectedOptionIcons = {
  arrivalCity: 'boxicons:plane-alt-filled',
  transfer: 'boxicons:taxi-filled',
} as const;

export function ReadyTourCard({ tour, onApply }: Readonly<ReadyTourCardProps>) {
  return (
    <article className={style.card}>
      <div className={style.card__selected}>
        <img
          src={tour.image}
          alt={tour.name}
          className={style.card__image}
        />

        <div className={style.card__selectedContent}>
          <h3 className={style.card__selectedTitle}>Уже выбрано:</h3>

          <div className={style.card__selectedOption}>
            <span className={style.card__optionLabel}>Активность:</span>
            <span className={style.card__optionValue}>{tour.activity}</span>
            <Icon
              icon={READY_TOUR_ACTIVITY_ICONS[tour.activity]}
              aria-hidden="true"
            />
          </div>

          <div className={style.card__selectedOption}>
            <span className={style.card__optionLabel}>Город прилёта:</span>
            <span className={style.card__optionValue}>{tour.arrivalCity}</span>
            <Icon
              icon={selectedOptionIcons.arrivalCity}
              aria-hidden="true"
            />
          </div>

          <div className={style.card__selectedOption}>
            <span className={style.card__optionLabel}>Трансфер:</span>
            <span className={style.card__optionValue}>{tour.transfer}</span>
            <Icon
              icon={selectedOptionIcons.transfer}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className={style.card__content}>
        <h2 className={style.card__title}>{tour.name}</h2>

        <div className={style.card__level}>
          <span className={style.card__levelLabel}>Уровень:</span>
          <span className={style.card__levelValue}>{tour.level}</span>
        </div>

        <div className={style.card__footer}>
          <div className={style.card__price}>
            <span className={style.card__priceFrom}>от</span>
            <strong className={style.card__priceValue}>{formatPrice(tour.price)} ₽</strong>
            <span className={style.card__pricePer}>за человека</span>
          </div>

          <Button
            text="В конструктор"
            variant="light"
            onClick={() => onApply?.(tour)}
          />
        </div>
      </div>
    </article>
  );
}
