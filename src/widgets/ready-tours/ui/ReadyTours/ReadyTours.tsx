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
          <p className={style.readyTours__description}>
            Выберите готовый вариант и при необходимости измените его в конструкторе.
          </p>
        </div>

        <a
          className={style.readyTours__link}
          href="#all-ready-tours"
        >
          Все предложения
        </a>
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
        edgePadding={24}
        className={style.readyTours__slider}
        renderControls={({ onPrevious, onNext, previousDisabled, nextDisabled, progress }) => (
          <div className={style.readyTours__controls}>
            <IconButton
              icon="material-symbols:arrow-back-rounded"
              variant="pagination"
              ariaLabel="Предыдущий готовый вариант"
              onClick={onPrevious}
              disabled={previousDisabled}
            />

            <div className={style.readyTours__progress}>
              <div
                className={style.readyTours__progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <IconButton
              icon="material-symbols:arrow-forward-rounded"
              variant="pagination"
              ariaLabel="Следующий готовый вариант"
              onClick={onNext}
              disabled={nextDisabled}
            />
          </div>
        )}
      />
    </section>
  );
}
