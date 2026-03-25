import { CSSProperties } from 'react'
import './variables.css'
import style from './paginationdots.module.scss'

interface PaginationDotsProps {
  total: number
  current: number
  onDotClick: (index: number) => void
  maxDots?: number
  counter?: boolean
}

const PaginationDots = ({
                          total,
                          current,
                          onDotClick,
                          maxDots = 5,
                          counter = false
                        }: PaginationDotsProps) => {
  const start = Math.max(0, Math.min(current - Math.floor(maxDots / 2), total - maxDots))
  const end = start + maxDots
  const offset = -start * 16

  const getDotClasses = (index: number) => {
    const classes = [style.paginationdots__dot]

    if (index === current) {
      classes.push(style['paginationdots__dot--active'])
    } else if (index >= start && index < end) {
      classes.push(style['paginationdots__dot--inView'])
    }

    if ((index === start && start > 0) || (index === end - 1 && end < total)) {
      classes.push(style['paginationdots__dot--edge'])
    }

    return classes.join(' ')
  }

  const handleDotClick = (index: number) => {
    if (index !== current) {
      onDotClick(index)
    }
  }

  const dotsWrapperStyle: CSSProperties = {
    width: `${maxDots * 2 * 10}px`
  }

  const dotsContainerStyle: CSSProperties = {
    transform: `translateX(${offset}px)`
  }

  return (
    <div className={style.paginationdots}>
      <div className={style.paginationdots__dotsWrapper} style={dotsWrapperStyle}>
        <div className={style.paginationdots__dotsContainer} style={dotsContainerStyle}>
          {Array.from({ length: total }, (_, index) => (
            <button
              key={index}
              className={getDotClasses(index)}
              onClick={() => handleDotClick(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {counter && total > maxDots && (
        <div className={style.paginationdots__counter}>
          {current + 1} / {total}
        </div>
      )}
    </div>
  )
}

export default PaginationDots
