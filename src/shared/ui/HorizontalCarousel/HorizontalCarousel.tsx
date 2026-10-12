import { Children, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import style from './horizontalcarousel.module.scss';

export interface HorizontalCarouselControls {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled: boolean;
  nextDisabled: boolean;
  progress: number;
}

interface CarouselPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface HorizontalCarouselProps {
  items: ReactNode[];
  windowWidth?: number;
  gap?: number | string;
  edgePadding?: number;
  windowPadding?: CarouselPadding;
  className?: string;
  renderControls?: (controls: HorizontalCarouselControls) => ReactNode;
  renderWindowControls?: (controls: HorizontalCarouselControls) => ReactNode;
}

interface CardMeasurement {
  left: number;
  width: number;
}

const DEFAULT_WINDOW_WIDTH = 1440;
const DEFAULT_GAP = 24;
const DEFAULT_EDGE_PADDING = 0;
const DEFAULT_VERTICAL_PADDING = 24;

export function HorizontalCarousel({
  items,
  windowWidth = DEFAULT_WINDOW_WIDTH,
  gap = DEFAULT_GAP,
  edgePadding = DEFAULT_EDGE_PADDING,
  windowPadding,
  className,
  renderControls,
  renderWindowControls,
}: Readonly<HorizontalCarouselProps>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState<CardMeasurement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const children = Children.toArray(items);

  const paddingTop = windowPadding?.top ?? DEFAULT_VERTICAL_PADDING;
  const paddingRight = windowPadding?.right ?? edgePadding;
  const paddingBottom = windowPadding?.bottom ?? DEFAULT_VERTICAL_PADDING;
  const paddingLeft = windowPadding?.left ?? edgePadding;

  const measure = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const savedTransform = track.style.transform;
    track.style.transform = 'none';

    const trackRect = track.getBoundingClientRect();
    const cards = Array.from(track.children) as HTMLElement[];

    const nextMeasurements = cards.map((card) => {
      const rect = card.getBoundingClientRect();

      return {
        left: rect.left - trackRect.left,
        width: rect.width,
      };
    });

    track.style.transform = savedTransform;
    setMeasurements(nextMeasurements);
  }, []);

  useEffect(() => {
    measure();

    const timer = window.setTimeout(measure, 100);

    return () => window.clearTimeout(timer);
  }, [items.length, measure]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [measure]);

  const lastCard = measurements.at(-1);
  const totalWidth = lastCard ? lastCard.left + lastCard.width : 0;
  const viewportWidth = Math.max(0, windowWidth - paddingLeft - paddingRight);
  const maxOffset = Math.max(0, totalWidth - viewportWidth);

  const getOffset = useCallback(
    (index: number) => {
      if (index <= 0 || measurements.length === 0) return 0;

      const boundedIndex = Math.min(index, measurements.length - 1);
      const { left, width } = measurements[boundedIndex];

      if (boundedIndex === measurements.length - 1) return maxOffset;

      const centeredOffset = left + width / 2 - viewportWidth / 2;

      return Math.min(Math.max(0, centeredOffset), maxOffset);
    },
    [maxOffset, measurements, viewportWidth],
  );

  const currentOffset = getOffset(activeIndex);

  const findNextIndex = (offset: number) => {
    const visibleRightEdge = offset + viewportWidth;

    for (let index = 0; index < measurements.length; index += 1) {
      const cardRight = measurements[index].left + measurements[index].width;

      if (cardRight > visibleRightEdge + 5) return index;
    }

    return measurements.length - 1;
  };

  const findPreviousIndex = (offset: number) => {
    for (let index = measurements.length - 1; index >= 0; index -= 1) {
      if (measurements[index].left < offset - 5) return index;
    }

    return 0;
  };

  const onNext = () => {
    if (currentOffset >= maxOffset - 1) return;

    setActiveIndex(findNextIndex(currentOffset));
  };

  const onPrevious = () => {
    if (currentOffset <= 1) return;

    setActiveIndex(findPreviousIndex(currentOffset));
  };

  const previousDisabled = currentOffset <= 1;
  const nextDisabled = currentOffset >= maxOffset - 1 || maxOffset <= 0;
  const progress = maxOffset > 0 ? Math.min(100, (currentOffset / maxOffset) * 100) : 0;

  const controls: HorizontalCarouselControls = {
    onPrevious,
    onNext,
    previousDisabled,
    nextDisabled,
    progress,
  };

  const trackStyle: CSSProperties = {
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    transform: `translateX(-${currentOffset}px)`,
  };

  const windowStyle: CSSProperties = {
    width: windowWidth,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  };

  const windowControlsStyle: CSSProperties = {
    top: paddingTop,
    bottom: paddingBottom,
  };

  const rootClassName = [style.horizontalcarousel, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      <div
        className={style.horizontalcarousel__window}
        style={windowStyle}
      >
        <div
          ref={trackRef}
          className={style.horizontalcarousel__track}
          style={trackStyle}
        >
          {Children.map(children, (child) => (
            <div className={style.horizontalcarousel__item}>{child}</div>
          ))}
        </div>

        {renderWindowControls && (
          <div
            className={style.horizontalcarousel__windowControls}
            style={windowControlsStyle}
          >
            {renderWindowControls(controls)}
          </div>
        )}
      </div>

      {renderControls?.(controls)}
    </div>
  );
}
