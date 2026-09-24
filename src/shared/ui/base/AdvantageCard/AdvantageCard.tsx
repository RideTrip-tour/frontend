import style from './advantagecard.module.scss'
import './variables.css'
import { Icon } from '@iconify/react'

interface AdvantageCardProps {
  icon: string
  title: string
  text: string
}

const AdvantageCard = ({ icon, title, text }: AdvantageCardProps) => {
  return (
    <div className={style.advantagecard}>
      <div className={style.advantagecard__iconWrap}>
        <Icon icon={icon} width="40" className={style.advantagecard__icon} />
      </div>

      <h3 className={style.advantagecard__title}>{title}</h3>

      <p className={style.advantagecard__text}>{text}</p>
    </div>
  )
}

export default AdvantageCard