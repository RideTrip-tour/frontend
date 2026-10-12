import { Link } from 'react-router';

import { ChevronRightIcon } from '@/assets/icons';
import { HorizontalCarousel } from '@/shared/ui/HorizontalCarousel';
import { IconButton } from '@/shared/ui/IconButton';

import { READY_TOURS, type ReadyTourPreset } from '../../model';
import { ReadyTourCard } from '../ReadyTourCard';

import style from './ReadyTours.module.scss';

interface ReadyToursProps {
  onApply?: (tour: ReadyTourPreset) => void;
}

export function ReadyTours({ onApply }: Readonly<ReadyToursProps>) {
  return (
    <section
      id="all-ready-tours"
      className={style.readyTours}
    >
      <div className={style.readyTours__header}>
        <div>
          <h2 className={style.readyTours__title}>Готовые варианты</h2>
          {/* <p className={style.readyTours__description}>
            Выберите готовый вариант и при необходимости измените его в конструкторе.
          </p> */}
        </div>

        <Link
          to="/other"
          className={style.readyTours__link}
        >
          <span>Все предложения</span>
          <ChevronRightIcon aria-hidden="true" />
        </Link>
      </div>

      <HorizontalCarousel
        items={READY_TOURS.map((tour) => (
          <ReadyTourCard
            key={tour.id}
            tour={tour}
            onApply={onApply}
          />
        ))}
        windowWidth={1420}
        windowPadding={{
          top: 16,
          right: 40,
          bottom: 0,
          left: 24,
        }}
        className={style.readyTours__slider}
        renderWindowControls={({ onPrevious, onNext, previousDisabled, nextDisabled }) => (
          <div className={style.readyTours__arrows}>
            <div className={style.readyTours__arrow}>
              <IconButton
                icon="iconamoon:arrow-left-2"
                variant="pagination"
                ariaLabel="Предыдущий готовый вариант"
                onClick={onPrevious}
                disabled={previousDisabled}
              />
            </div>

            <div className={style.readyTours__arrow}>
              <IconButton
                icon="iconamoon:arrow-right-2"
                variant="pagination"
                ariaLabel="Следующий готовый вариант"
                onClick={onNext}
                disabled={nextDisabled}
              />
            </div>
          </div>
        )}
        renderControls={({ progress }) => (
          <div className={style.readyTours__controls}>
            <div className={style.readyTours__progress}>
              <div
                className={style.readyTours__progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      />
    </section>
  );
}
