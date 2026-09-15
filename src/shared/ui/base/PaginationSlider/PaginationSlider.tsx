import { useState, useRef } from 'react'
import type { MouseEvent, TouchEvent, ReactNode, RefObject } from 'react'
import './variables.css'
import style from './paginationslider.module.scss'
import PaginationDots from './PaginationDots'

import Loader from '../Loader'
import {useInfiniteLoader} from '@/hooks/useInfiniteLoader.ts'
import {wrapSliderChildren} from '@/utils/wrapChildrenWithIndex.tsx'

interface PaginationSliderProps {
  children: ReactNode
  showPagination?: boolean
  onLoadMore?: (count?: number) => void | Promise<void>
  loadThreshold?: number
  itemsPerLoad?: number
  maxItems?: number
  isLoading?: boolean
  loaderComponent?: ReactNode
  className?: string
}

const PaginationSlider = ({
                            children,
                            showPagination = true,
                            onLoadMore,
                            loadThreshold = 3,
                            itemsPerLoad = 10,
                            maxItems = Infinity,
                            isLoading = false,
                            loaderComponent,
                            className
                          }: PaginationSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)

  const sliderRef = useRef<HTMLDivElement | null>(null)

  const childrenArray = Array.isArray(children) ? children : [children]
  const totalItems = childrenArray.length

  const { shouldShowLoader } = useInfiniteLoader({
    onLoadMore,
    loadThreshold,
    itemsPerLoad,
    maxItems,
    isLoading,
    totalItems,
    containerRef: sliderRef as RefObject<HTMLElement>,
    enabled: !!onLoadMore
  })

  const showLoader = shouldShowLoader && isLoading

  const totalSlides = showLoader ? totalItems + 1 : totalItems

  const getPositionX = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    return 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleStart = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    setIsDragging(true)
    setStartX(getPositionX(e))
    setTranslateX(-currentSlide * 100)
  }

  const handleMove = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (!isDragging || !sliderRef.current) return

    const currentX = getPositionX(e)
    const diff = currentX - startX
    const slideWidth = sliderRef.current.offsetWidth
    const percentMove = (diff / slideWidth) * 100

    setTranslateX(-currentSlide * 100 + percentMove)
  }

  const handleEnd = () => {
    if (!isDragging || !sliderRef.current) return

    setIsDragging(false)

    const slideWidth = sliderRef.current.offsetWidth
    const movedBy = ((translateX + currentSlide * 100) * slideWidth) / 100

    let newSlide = currentSlide

    if (movedBy < -slideWidth / 4 && currentSlide < totalSlides - 1) {
      newSlide = currentSlide + 1
    } else if (movedBy > slideWidth / 4 && currentSlide > 0) {
      newSlide = currentSlide - 1
    }

    setCurrentSlide(newSlide)
    setTranslateX(-newSlide * 100)
  }

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
    setTranslateX(-index * 100)
  }

  const wrappedChildren = wrapSliderChildren({
    children,
    className: style.paginationslider__slide
  })

  return (
    <div className={`${style.paginationslider} ${className || ''}`}>
      <div
        ref={sliderRef}
        className={style.paginationslider__wrapper}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div
          className={style.paginationslider__track}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? 'none' : 'transform 350ms ease'
          }}
        >
          {wrappedChildren}

          {showLoader && (
            <div
              key="loader"
              data-index={totalItems}
              className={style.paginationslider__slide}
            >
              {loaderComponent || <Loader />}
            </div>
          )}
        </div>
      </div>

      {showPagination && (
        <PaginationDots
          total={totalSlides}
          current={currentSlide}
          onDotClick={handleDotClick}
        />
      )}
    </div>
  )
}

export default PaginationSlider