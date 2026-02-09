import {RefObject, useEffect, useRef, useState} from 'react'

interface UseInfiniteLoaderProps {
  onLoadMore?: (count: number | undefined) => void | Promise<void>;
  loadThreshold?: number;
  itemsPerLoad?: number;
  maxItems?: number;
  isLoading?: boolean;
  totalItems: number;
  containerRef: RefObject<HTMLElement>;
  enabled?: boolean;
}

export const useInfiniteLoader = ({
                                    onLoadMore,
                                    loadThreshold = 3,
                                    itemsPerLoad = 10,
                                    maxItems = Infinity,
                                    isLoading = false,
                                    totalItems,
                                    containerRef,
                                    enabled = true
                                  }: UseInfiniteLoaderProps) => {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const hasLoadedMoreRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current || !enabled || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleIndices((prev) => {
          const newSet = new Set(prev);
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              if (entry.isIntersecting) {
                newSet.add(index);
              } else {
                newSet.delete(index);
              }
            }
          });
          return newSet;
        });
      },
      {
        root: containerRef.current,
        threshold: 0.3,
        rootMargin: '0px 200px 0px 0px'
      }
    );

    const children = containerRef.current.querySelectorAll('[data-index]');
    children.forEach((child) => observerRef.current?.observe(child));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [totalItems, containerRef, enabled, onLoadMore]);

  useEffect(() => {
    if (!onLoadMore || !enabled || isLoading || hasLoadedMoreRef.current || totalItems >= maxItems) {
      return;
    }

    if (visibleIndices.size === 0) return;

    const maxVisibleIndex = Math.max(...Array.from(visibleIndices));
    const remainingItems = totalItems - maxVisibleIndex - 1;
    const shouldLoadMore = remainingItems <= loadThreshold;

    if (shouldLoadMore) {
      hasLoadedMoreRef.current = true;
      Promise.resolve(onLoadMore(itemsPerLoad)).finally(() => {
        hasLoadedMoreRef.current = false;
      });
    }
  }, [visibleIndices, totalItems, onLoadMore, loadThreshold, itemsPerLoad, maxItems, isLoading, enabled]);

  return {
    visibleIndices,
    shouldShowLoader: enabled && !!onLoadMore && totalItems < maxItems
  };
};