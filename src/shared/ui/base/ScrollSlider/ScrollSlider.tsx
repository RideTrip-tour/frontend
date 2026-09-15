import {
  forwardRef,
  Children,
  type ReactNode,
  type RefObject, type CSSProperties
} from 'react'
import './variables.css'
import style from './scrollslider.module.scss'
import { useHorizontalDragScroll } from '@/hooks/useHorizontalDragScroll'
import { useInfiniteLoader } from '@/hooks/useInfiniteLoader'
import { wrapSliderChildren } from '@/utils/wrapChildrenWithIndex'
import Loader from '@/shared/ui/base/Loader'

type ScrollDirection = 'horizontal' | 'vertical' | 'grid'

interface ScrollSliderProps {
  children: ReactNode
  className?: string
  gap?: string

  direction?: ScrollDirection
  columns?: number

  onLoadMore?: (count?: number) => void | Promise<void>;
  loadThreshold?: number
  itemsPerLoad?: number
  maxItems?: number
  isLoading?: boolean
  loaderComponent?: ReactNode
}

const ScrollSlider = forwardRef<HTMLDivElement, ScrollSliderProps>(
  (
    {
      children,
      className,
      gap = '10px',
      direction = 'horizontal',
      columns = 5,

      onLoadMore,
      loadThreshold = 3,
      itemsPerLoad = 10,
      maxItems = Infinity,
      isLoading = false,
      loaderComponent
    },
    forwardedRef
  ) => {
    const scrollRef = useHorizontalDragScroll<HTMLDivElement>()
    const childrenArray = Children.toArray(children)
    const totalItems = childrenArray.length

    const { shouldShowLoader } = useInfiniteLoader({
      onLoadMore,
      loadThreshold,
      itemsPerLoad,
      maxItems,
      isLoading,
      totalItems,
      containerRef: scrollRef as RefObject<HTMLElement>,
      enabled: !!onLoadMore
    })

    const mergedRef = (el: HTMLDivElement | null) => {
      scrollRef.current = el

      if (typeof forwardedRef === 'function') {
        forwardedRef(el)
      } else if (forwardedRef) {
        forwardedRef.current = el
      }
    }

    const wrappedChildren = wrapSliderChildren({
      children,
      className: style.scrollslider__item
    })

    const containerClasses = [
      style.scrollslider,
      style[`scrollslider--${direction}`],
      className
    ]
      .filter(Boolean)
      .join(' ')

    const trackStyle: CSSProperties = {
      gap
    }

    if (direction === 'grid') {
      trackStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`
    }

    return (
      <div ref={mergedRef} className={containerClasses}>
        <div className={style.scrollslider__track} style={trackStyle}>
          {wrappedChildren}

          {shouldShowLoader && isLoading && (
            <div
              className={style.scrollslider__item}
              data-index={totalItems}
            >
              {loaderComponent || <Loader />}
            </div>
          )}
        </div>
      </div>
    )
  }
)

ScrollSlider.displayName = 'ScrollSlider'
export default ScrollSlider
