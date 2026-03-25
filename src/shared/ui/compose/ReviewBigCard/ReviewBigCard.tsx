import style from './reviewbigcard.module.scss'
import './variables.css'

import RatingStars from '@/shared/ui/base/RatingStars'
import SmallCategory from '@/shared/ui/base/SmallCategory'

interface ReviewBigCardProps {
  photo: string
  name: string
  category: string
  rating: number
  date: string
  text: string
}

const ReviewBigCard = ({
                         photo,
                         name,
                         category,
                         rating,
                         date,
                         text,
                       }: ReviewBigCardProps) => {
  return (
    <div className={style.card}>

      <div className={style.card__body}>

        <div className={style.card__author}>
          <img
            src={photo}
            alt={name}
            className={style.card__avatar}
          />
          <div className={style.card__authorInfo}>
            <span className={style.card__name}>{name}</span>
            <SmallCategory text={category} />
          </div>
        </div>

        <p className={style.card__text}>{text}</p>

      </div>

      <div className={style.card__footer}>
        <RatingStars value={rating} />

        <div className={style.card__date}>
          <span className={style.card__dateLabel}>Дата</span>
          <span className={style.card__dateValue}>{date}</span>
        </div>
      </div>

    </div>
  )
}

export default ReviewBigCard