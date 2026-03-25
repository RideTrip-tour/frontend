import { useRef, useEffect } from 'react';

const DRAG_THRESHOLD = 7;

export const useHorizontalDragScroll = <T extends HTMLElement>() => {
  const containerRef = useRef<T | null>(null);
  const dragState = useRef({
    pointerStartX: 0,
    scrollStartLeft: 0,
    isDragging: false
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      dragState.current = {
        pointerStartX: event.pageX,
        scrollStartLeft: container.scrollLeft,
        isDragging: false
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (dragState.current.pointerStartX === 0) return;

      const pointerDeltaX = event.pageX - dragState.current.pointerStartX;
      if (Math.abs(pointerDeltaX) > DRAG_THRESHOLD) {
        dragState.current.isDragging = true;
      }

      container.scrollLeft = dragState.current.scrollStartLeft - pointerDeltaX;
    };

    const handleMouseUp = () => {
      dragState.current.pointerStartX = 0;
    };

    const handleClick = (event: MouseEvent) => {
      if (dragState.current.isDragging) {
        event.preventDefault();
        event.stopPropagation();
        dragState.current.isDragging = false;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick, true);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick, true);
    };
  }, []);

  return containerRef;
};