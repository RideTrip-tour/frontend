import style from './badge.module.scss'
import './variables.css'

interface BadgeProps {
  text: string
}

const Badge = ({ text }: BadgeProps) => {
  return (
    <div className={style.badge}>
      <span className={style.badge__text}>
        {text}
      </span>
    </div>
  )
}

export default Badge