import style from './drumroller.module.scss'
import './variables.css'
import { useState, useRef, useEffect, useCallback } from "react";
import {
  DRUM_HALF_ITEMS,
  DRUM_ITEM_HEIGHT_PX,
  DRUM_VISIBLE_ITEMS
} from '@/shared/ui/compose/DateRangePicker/constants.ts'

export interface DrumRollerProps {
  items: readonly string[];
  selectedIndex: number;
  minValidIndex?: number;
  maxValidIndex?: number;
  onChange: (index: number) => void;
}

export function DrumRoller({
                             items,
                             selectedIndex,
                             minValidIndex = 0,
                             maxValidIndex,
                             onChange,
                           }: DrumRollerProps) {
  const maxValid = maxValidIndex ?? items.length - 1;

  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragCurrentDeltaRef = useRef(0);
  const didMoveBeyondThresholdRef = useRef(false);

  const selectedIndexRef = useRef(selectedIndex);
  const minValidRef = useRef(minValidIndex);
  const maxValidRef = useRef(maxValid);
  const onChangeRef = useRef(onChange);

  useEffect(() => { selectedIndexRef.current = selectedIndex; }, [selectedIndex]);
  useEffect(() => { minValidRef.current = minValidIndex; }, [minValidIndex]);
  useEffect(() => { maxValidRef.current = maxValid; }, [maxValid]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const commitDelta = useCallback((deltaPx: number) => {
    setDragOffsetPx(0);
    setIsDragging(false);
    const rawSteps = -Math.round(deltaPx / DRUM_ITEM_HEIGHT_PX);
    const tentativeIndex = selectedIndexRef.current + rawSteps;
    const clampedIndex = Math.max(minValidRef.current, Math.min(maxValidRef.current, tentativeIndex));
    if (clampedIndex !== selectedIndexRef.current) {
      onChangeRef.current(clampedIndex);
    }
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragCurrentDeltaRef.current = 0;
    didMoveBeyondThresholdRef.current = false;
    setIsDragging(true);
    setDragOffsetPx(0);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientY - dragStartYRef.current;
      dragCurrentDeltaRef.current = delta;
      if (Math.abs(delta) >= 4) didMoveBeyondThresholdRef.current = true;
      setDragOffsetPx(delta);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      if (didMoveBeyondThresholdRef.current) {
        commitDelta(dragCurrentDeltaRef.current);
      } else {
        setDragOffsetPx(0);
        setIsDragging(false);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [commitDelta]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartYRef.current = e.touches[0].clientY;
    dragCurrentDeltaRef.current = 0;
    didMoveBeyondThresholdRef.current = false;
    setIsDragging(true);
    setDragOffsetPx(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const delta = e.touches[0].clientY - dragStartYRef.current;
    dragCurrentDeltaRef.current = delta;
    if (Math.abs(delta) >= 4) didMoveBeyondThresholdRef.current = true;
    setDragOffsetPx(delta);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    commitDelta(dragCurrentDeltaRef.current);
  }, [commitDelta]);

  const wheelAccumRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccumRef.current += e.deltaY;
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        const steps = Math.round(wheelAccumRef.current / 40);
        const newIndex = Math.max(
          minValidRef.current,
          Math.min(maxValidRef.current, selectedIndexRef.current + steps)
        );
        wheelAccumRef.current = 0;
        if (newIndex !== selectedIndexRef.current) onChangeRef.current(newIndex);
      }, 80);
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const containerHeightPx = DRUM_ITEM_HEIGHT_PX * DRUM_VISIBLE_ITEMS;
  const bandCenterPx = DRUM_ITEM_HEIGHT_PX * DRUM_HALF_ITEMS;

  return (
    <div
      ref={containerRef}
      className={`${style.drumroller} ${isDragging ? style['drumroller--dragging'] : ''}`}
      style={{
        position: 'relative',
        height: containerHeightPx,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={style.drumroller__centerBand}
        style={{
          top: bandCenterPx,
          height: DRUM_ITEM_HEIGHT_PX
        }}
      />

      {items.map((label, index) => {
        const itemTopPx = bandCenterPx + (index - selectedIndex) * DRUM_ITEM_HEIGHT_PX + dragOffsetPx;
        if (itemTopPx < -(DRUM_ITEM_HEIGHT_PX * 1.5) || itemTopPx > containerHeightPx + DRUM_ITEM_HEIGHT_PX * 0.5) return null;
        const distanceFromCenter = Math.abs(itemTopPx - bandCenterPx) / DRUM_ITEM_HEIGHT_PX;
        const isAtCenter = distanceFromCenter < 0.5;
        const isOutOfRange = index < minValidIndex || index > maxValid;

        const itemClass = [
          style.drumroller__item,
          isAtCenter && style['drumroller__item--selected'],
          !isAtCenter && distanceFromCenter < 1.5 && style['drumroller__item--near'],
          !isAtCenter && distanceFromCenter >= 1.5 && style['drumroller__item--far'],
          isOutOfRange && style['drumroller__item--disabled']
        ].filter(Boolean).join(' ');

        return (
          <div
            key={index}
            className={itemClass}
            style={{ top: itemTopPx }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfRange && !didMoveBeyondThresholdRef.current) onChange(index);
            }}
          >
            {label}
          </div>
        );
      })}

      <div className={style.drumroller__gradientTop} />
      <div className={style.drumroller__gradientBottom} />
    </div>
  );
}