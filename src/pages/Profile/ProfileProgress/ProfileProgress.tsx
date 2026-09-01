import style from './profileprogress.module.scss'
import './variables.css'

interface ProfileProgressProps {
  value: number
}

const ProfileProgress = ({ value = 0 }: ProfileProgressProps) => {
  const safeValue = Math.max(0, Math.min(100, value))
  const fillWidth = `${safeValue}%`

  return (
    <div className={style.profileprogress}>
      <div className={style.profileprogress__bar}>
        <div
          className={style.profileprogress__fill}
          style={{ width: fillWidth }}
        />
      </div>

      <div className={style.profileprogress__text}>
        Профиль заполнен на {safeValue}%
      </div>

      <div className={style.profileprogress__title}>
        Заполните профиль, чтобы получать более точные подборки
      </div>
    </div>
  )
}

export default ProfileProgress