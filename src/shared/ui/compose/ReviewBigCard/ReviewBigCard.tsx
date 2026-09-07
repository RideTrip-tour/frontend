import style from './reviewbigcard.module.scss'
import './variables.css'
import {Icon} from '@iconify/react'

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
  const stars = Array.from({length: 5}, (_, i) => i < Math.round(rating))

  return (
    <article className={style.card}>

      <div className={style.card__author}>
        <img
          src={photo}
          alt={name}
          className={style.card__avatar}
        />
        <div className={style.card__authorInfo}>
          <span className={style.card__name}>{name}</span>
          <span className={style.card__badge}>{category}</span>
          <span className={style.card__ratingLabel}>Оценка</span>
          <div className={style.card__stars}>
            {stars.map((active, i) => (
              <Icon
                key={i}
                icon={
                  active
                    ? 'material-symbols:star-rounded'
                    : 'material-symbols:star-outline-rounded'
                }
                className={style.card__star}
              />
            ))}
          </div>
        </div>
      </div>

      <p className={style.card__text}>{text}</p>

      <div className={style.card__date}>
        <span className={style.card__dateLabel}>Дата</span>
        <span className={style.card__dateValue}>{date}</span>
      </div>

    </article>
  )
}

export default ReviewBigCard