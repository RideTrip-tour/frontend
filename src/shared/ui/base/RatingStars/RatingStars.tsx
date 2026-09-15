import style from './ratingstars.module.scss'
import './variables.css'
import { Icon } from '@iconify/react'

interface RatingStarsProps {
  value: number
}

const RatingStars = ({ value }: RatingStarsProps) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={style.ratingstars}>

      <div className={style.ratingstars__label}>
        Оценка
      </div>

      <div className={style.ratingstars__stars}>
        {stars.map((star) => (
          <Icon
            key={star}
            icon="material-symbols:star-rounded"
            width="16"
            className={
              star <= value
                ? `${style.ratingstars__star} ${style['ratingstars__star--active']}`
                : `${style.ratingstars__star} ${style['ratingstars__star--inactive']}`
            }
          />
        ))}
      </div>

    </div>
  )
}

export default RatingStars