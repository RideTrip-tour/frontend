import type { ReactElement } from 'react';

import { HorizontalCarousel } from '@/shared/ui/HorizontalCarousel';
import { IconButton } from '@/shared/ui/IconButton';

import style from './resortslider.module.scss';

interface ResortSliderProps {
  windowWidth?: number;
  className?: string;
  items: ReactElement[];
}

export const ResortSlider = ({ windowWidth = 1440, className, items }: ResortSliderProps) => {
  const rootClassName = [style.resortsliderWrapper, className].filter(Boolean).join(' ');

  return (
    <HorizontalCarousel
      items={items}
      windowWidth={windowWidth}
      edgePadding={24}
      className={rootClassName}
      renderControls={({ onPrevious, onNext, previousDisabled, nextDisabled, progress }) => (
        <div className={style.resortslider__controls}>
          <div className={style.resortslider__buttons}>
            <IconButton
              icon="material-symbols:arrow-back-rounded"
              variant="pagination"
              ariaLabel="Предыдущий курорт"
              onClick={onPrevious}
              disabled={previousDisabled}
            />

            <div className={style.resortslider__progressWrap}>
              <div
                className={style.resortslider__progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <IconButton
              icon="material-symbols:arrow-forward-rounded"
              variant="pagination"
              ariaLabel="Следующий курорт"
              onClick={onNext}
              disabled={nextDisabled}
            />
          </div>
        </div>
      )}
    />
  );
};
