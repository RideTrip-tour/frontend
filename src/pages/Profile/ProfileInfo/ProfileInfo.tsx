import { Icon } from '@iconify/react'
import style from './profileinfo.module.scss'
import './variables.css'

const ProfileInfo = () => {
  return (
    <div className={style.profileinfo}>
      <div className={style.profileinfo__icon}>
        <Icon icon="material-symbols:info-rounded" width={20} height={20} />
      </div>
      <div className={style.profileinfo__text}>
        Для оформления тура понадобится имя и email. Остальное заполняйте в любом порядке — или пропустите совсем.
      </div>
    </div>
  )
}

export default ProfileInfo