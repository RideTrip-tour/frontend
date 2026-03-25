import style from './card.module.scss'
import './variables.css'

interface CardProps {
  imageSrc: string
  title: string
  description?: string
  onClick?: () => void
}

const Card = ({imageSrc, title, description, onClick}: CardProps) => {
  return (
    <div
      className={style.card}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className={style.card__image}>
        <img src={imageSrc}
             alt={title}
        />
      </div>

      <div className={style.card__content}>
        <div className={style.card__title}>
          <div className={style.card__title_text}>
            {title}
          </div>
        </div>
        {description && (
          <div className={style.card__description}>
            <div className={style.card__description_text}>
              {description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
