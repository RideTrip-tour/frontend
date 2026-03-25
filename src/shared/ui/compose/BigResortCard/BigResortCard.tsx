import style from './bigresortcard.module.scss'
import './variables.css'

import {Icon} from '@iconify/react'
import SkillsLevel from '@/shared/ui/base/SkillsLevel'
import Badge from '@/shared/ui/base/Badge'
import SmallCategory from '@/shared/ui/base/SmallCategory'
import RatingNumber from '@/shared/ui/base/RatingNumber'
import {Button} from '@/shared/ui/base/Button'

export interface BigResortCardProps {
  image: string
  title: string
  level: 0 | 1 | 2 | 3
  badgeText?: string
  rating: number
  reviews: number
  category: string
  price: number
  info: string[]
  conditions: string[]
  active?: boolean
}

const formatPrice = (price: number) =>
  price.toLocaleString('ru-RU')

const conditionMap: Record<string, { icon: string; text: string }> = {
  tracks: {
    icon: 'material-symbols:snowboarding-rounded',
    text: '12 трасс'
  },
  lift: {
    icon: 'hugeicons:cable-car',
    text: 'Подъемник рядом'
  },
  snow: {
    icon: 'mingcute:snow-line',
    text: 'Средний снегопад'
  },
  transfer: {
    icon: 'tabler:clock',
    text: 'Трансфер: 3 часа'
  }
}

const BigResortCard = ({
                         image,
                         title,
                         level,
                         badgeText,
                         rating,
                         reviews,
                         category,
                         price,
                         info,
                         conditions,
                         active = false
                       }: BigResortCardProps) => {

  return (
    <div className={`${style.card} ${active ? style['card--active'] : ''}`}>
      <div className={style.card__imageWrapper}>
        <img
          src={image}
          className={style.card__image}
          alt={title}
        />


      </div>
      {badgeText && (
        <div className={style.card__badge}>
          <Badge text={badgeText} />
        </div>
      )}
      <div className={style.card__content}>

        <div className={style.card__header}>

          <div className={style.card__titleBlock}>
            <h2 className={style.card__title}>{title}</h2>
            <div className={style.card__rating}>
              <RatingNumber value={rating} />
              <div className={style.card__divider} />
              <span className={style.card__reviews}>
              {reviews} отзывов
            </span>
            </div>
          </div>
          <div className={style.card__tags}>
            <SkillsLevel level={level} />
            <SmallCategory text={category} />
          </div>

        </div>

        <div className={style.card__line} />

        <div className={style.card__info}>

          <h3 className={style.card__subtitle}>
            Дополнительная информация:
          </h3>

          <ul className={style.card__list}>
            {info.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>

        </div>

        <div className={style.card__conditions}>

          <h3 className={style.card__subtitle}>
            Маршруты и условия:
          </h3>

          <div className={style.card__conditionList}>
            {conditions.map((c, i) => {
              const condition = conditionMap[c]

              if (!condition) return null

              return (
                <div
                  key={i}
                  className={style.card__condition}
                >
                  <Icon icon={condition.icon}
                        width="20"
                  />

                  <span>{condition.text}</span>
                </div>
              )
            })}
          </div>

        </div>

        <div className={style.card__line} />

        <div className={style.card__footer}>

          <div className={style.card__price}>
            <span className={style.card__priceFrom}>
              от
            </span>

            <span className={style.card__priceValue}>
              {formatPrice(price)} ₽
            </span>

            <span className={style.card__pricePer}>
              за человека
            </span>
          </div>

          <Button
            text="Подробнее"
            onClick={() => {
            }}
            variant={'secondary'}
          />

        </div>

      </div>

    </div>
  )
}

export default BigResortCard