import style from './profileprogress.module.scss'
import './variables.css'

interface ProfileProgressProps {
  value: number
}

const ProfileProgress = ({ value = 0 }: ProfileProgressProps) => {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={style.profileprogress}>
      <div className={style.profileprogress__header}>
        <div className={style.profileprogress__header__title}>
          Расскажите о себе
        </div>

        <div className={style.profileprogress__header__subtitle}>
          Мы подберём варианты точнее, если будем знать о вас больше
        </div>
      </div>

      <div className={style.profileprogress__block}>
        <div className={style.profileprogress__bar}>
          <div
            className={style.profileprogress__fill}
            style={{ width: `${safeValue}%` }}
          />
        </div>

        <div className={style.profileprogress__text}>
          Профиль заполнен на {safeValue}%
        </div>
      </div>

    </div>
  )
}

export default ProfileProgress