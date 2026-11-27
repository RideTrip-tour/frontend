import { useId, useState, type ReactElement } from 'react';

import chevron from '@/assets/icons/ChevronRightIcon.svg';
import { ArrowRightIcon } from '@/assets/icons/constructor';
import ModalOverlay from '@/shared/ui/base/ModalOverlay';
import { Button } from '@/shared/ui/Button';
import { HorizontalCarousel } from '@/shared/ui/HorizontalCarousel';
import { IconButton } from '@/shared/ui/IconButton';

import style from './reviewslider.module.scss';

interface ReviewSliderProps {
  windowWidth?: number;
  className?: string;
  items: ReactElement[];
  onViewAll?: () => void;
  edgePadding?: number;
}

const ReviewSlider = ({
  windowWidth = 1440,
  className,
  items,
  onViewAll,
  edgePadding = 24,
}: ReviewSliderProps) => {
  const rootClassName = [style.reviewsliderWrapper, className].filter(Boolean).join(' ');
  const titleId = useId();
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <HorizontalCarousel
        items={items}
        windowWidth={windowWidth}
        edgePadding={edgePadding}
        windowPadding={{ top: 4, bottom: 8 }}
        className={rootClassName}
        renderControls={({ onPrevious, onNext, previousDisabled, nextDisabled }) => (
          <div className={style.reviewslider__controls}>
            <Button
              className={style.viewAll}
              icon={<ArrowRightIcon />}
              iconPosition="right"
              text="Смотреть все отзывы"
              variant="secondary"
              onClick={onViewAll ?? (() => setShowAll(true))}
            />

            <div className={style.reviewslider__buttons}>
              <IconButton
                icon={chevron}
                iconClassName={style.previousIcon}
                variant="pagination"
                ariaLabel="Предыдущий отзыв"
                onClick={onPrevious}
                disabled={previousDisabled}
              />

              <IconButton
                icon={chevron}
                variant="pagination"
                ariaLabel="Следующий отзыв"
                onClick={onNext}
                disabled={nextDisabled}
              />
            </div>
          </div>
        )}
      />
      {showAll && (
        <ModalOverlay
          variant="dimmed"
          ariaLabelledBy={titleId}
          onClose={() => setShowAll(false)}
        >
          <div className={style.dialog}>
            <div className={style.dialogHeader}>
              <h2 id={titleId}>Все отзывы</h2>
              <Button
                text="Закрыть"
                variant="light"
                onClick={() => setShowAll(false)}
              />
            </div>
            <div className={style.allReviews}>{items}</div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
};

export default ReviewSlider;
