import type { ReactElement } from 'react';

import { Button } from '@/shared/ui/Button';
import { HorizontalCarousel } from '@/shared/ui/HorizontalCarousel';
import { IconButton } from '@/shared/ui/IconButton';

import style from './reviewslider.module.scss';

interface ReviewSliderProps {
  windowWidth?: number;
  className?: string;
  items: ReactElement[];
  onViewAll?: () => void;
}

const ReviewSlider = ({ windowWidth = 1440, className, items, onViewAll }: ReviewSliderProps) => {
  const rootClassName = [style.reviewsliderWrapper, className].filter(Boolean).join(' ');

  return (
    <HorizontalCarousel
      items={items}
      windowWidth={windowWidth}
      edgePadding={24}
      className={rootClassName}
      renderControls={({ onPrevious, onNext, previousDisabled, nextDisabled }) => (
        <div className={style.reviewslider__controls}>
          <Button
            icon="material-symbols:arrow-forward-rounded"
            iconPosition="right"
            text="Смотреть все отзывы"
            variant="secondary"
            onClick={() => onViewAll?.()}
          />

          <div className={style.reviewslider__buttons}>
            <IconButton
              icon="iconamoon:arrow-left-2"
              variant="pagination"
              ariaLabel="Предыдущий отзыв"
              onClick={onPrevious}
              disabled={previousDisabled}
            />

            <IconButton
              icon="iconamoon:arrow-right-2"
              variant="pagination"
              ariaLabel="Следующий отзыв"
              onClick={onNext}
              disabled={nextDisabled}
            />
          </div>
        </div>
      )}
    />
  );
};

export default ReviewSlider;
