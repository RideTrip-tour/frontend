import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import style from './resortslider.module.scss';
import './variables.css'
import IconButton from '@/shared/ui/base/IconButton';

interface CardMeasurement {
  left: number;
  width: number;
}

interface ResortSliderProps {
  windowWidth?: number;
  className?: string;
  items: React.ReactElement[];
}

const ResortSlider: React.FC<ResortSliderProps> = ({
                                                     windowWidth = 1400,
                                                     className,
                                                     items = [],
                                                   }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState<CardMeasurement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const savedTransform = track.style.transform;
    track.style.transform = 'none';

    const trackRect = track.getBoundingClientRect();
    const cards = Array.from(track.children) as HTMLElement[];

    const next: CardMeasurement[] = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        left: rect.left - trackRect.left,
        width: rect.width,
      };
    });

    track.style.transform = savedTransform;
    setMeasurements(next);
  }, []);

  useEffect(() => {
    measure();
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [measure, items.length]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const lastCard = measurements[measurements.length - 1];
  const totalWidth = lastCard ? lastCard.left + lastCard.width : 0;
  const maxOffset = Math.max(0, totalWidth - windowWidth);

  const getOffset = useCallback(
    (index: number): number => {
      if (index <= 0 || measurements.length === 0) return 0;

      const idx = Math.min(index, measurements.length - 1);
      const { left, width } = measurements[idx];

      if (idx === measurements.length - 1) return maxOffset;

      const centered = left + width / 2 - windowWidth / 2;
      return Math.min(Math.max(0, centered), maxOffset);
    },
    [measurements, windowWidth, maxOffset]
  );

  const currentOffset = getOffset(activeIndex);

  const findNextIndex = (offset: number) => {
    const visibleRightEdge = offset + windowWidth;
    for (let i = 0; i < measurements.length; i++) {
      const cardRight = measurements[i].left + measurements[i].width;
      if (cardRight > visibleRightEdge + 5) return i;
    }
    return measurements.length - 1;
  };

  const findPrevIndex = (offset: number) => {
    for (let i = measurements.length - 1; i >= 0; i--) {
      if (measurements[i].left < offset - 5) return i;
    }
    return 0;
  };

  const handleNext = () => {
    if (currentOffset >= maxOffset - 1) return;
    setActiveIndex(findNextIndex(currentOffset));
  };

  const handlePrev = () => {
    if (currentOffset <= 1) return;
    setActiveIndex(findPrevIndex(currentOffset));
  };

  const isAtStart = currentOffset <= 1;
  const isAtEnd = currentOffset >= maxOffset - 1 || maxOffset <= 0;
  const progress = maxOffset > 0 ? (currentOffset / maxOffset) * 100 : 0;

  return (
    <div className={`${style.resortsliderWrapper} ${className || ''}`}>
      <div className={style.resortslider__window} style={{ width: windowWidth }}>
        <div
          ref={trackRef}
          className={style.resortslider__track}
          style={{ transform: `translateX(-${currentOffset}px)` }}
        >
          {items.map((item, i) => (
            <div key={i} className={style.resortslider__item}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className={style.resortslider__controls}>
        <div className={style.resortslider__buttons}>
          <IconButton
            icon="material-symbols:arrow-back-rounded"
            variant="pagination"
            onClick={handlePrev}
            disabled={isAtStart}
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
            onClick={handleNext}
            disabled={isAtEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default ResortSlider;