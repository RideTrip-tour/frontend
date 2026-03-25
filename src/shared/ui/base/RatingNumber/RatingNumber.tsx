import style from './ratingnumber.module.scss'
import './variables.css'
import { Icon } from '@iconify/react'

interface RatingNumberProps {
  value: number
}

const RatingNumber = ({ value }: RatingNumberProps) => {
  return (
    <div className={style.ratingnumber}>

      <Icon
        icon="material-symbols:star-rounded"
        width="28"
        className={style.ratingnumber__icon}
      />

      <div className={style.ratingnumber__value}>
        {value.toFixed(2)}
      </div>

    </div>
  )
}

export default RatingNumber