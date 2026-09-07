import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import style from './personalblock.module.scss'
import './variables.css'

interface PersonalBlockProps {
  title: string
  subtitle: string
  onEdit: () => void
  children?: ReactNode
}

const PersonalBlock = ({ title, subtitle, onEdit, children }: PersonalBlockProps) => (
  <div className={style.personalblock}>
    <div className={style.personalblock__header}>
      <div className={style.personalblock__header__text}>
        <div className={style.personalblock__header__title}>{title}</div>
        <div className={style.personalblock__header__subtitle}>{subtitle}</div>
      </div>
      <div className={style.personalblock__header__edit} onClick={onEdit}>
        <span className={style.personalblock__header__edit__text}>Редактировать</span>
        <span className={style.personalblock__header__edit__icon}>
          <Icon icon="solar:pen-bold" width="24" height="24" />
        </span>
      </div>
    </div>
    {children}
  </div>
)

export default PersonalBlock