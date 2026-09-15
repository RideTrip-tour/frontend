import style from './card.module.scss'
import './variables.css'

interface CardProps {
  imageSrc: string
  title: string
  description?: string
  onClick?: () => void
}

const Card = ({imageSrc, title, description, onClick}: CardProps) => {
  const content = (
    <>
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
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={style.card} onClick={onClick}>
        {content}
      </button>
    )
  }

  return <div className={style.card}>{content}</div>
}

export default Card
