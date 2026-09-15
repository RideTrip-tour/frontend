import { Icon } from '@iconify/react'
import './variables.css'
import style from './menurow.module.scss'

interface MenuRowProps {
  text: string
  icon?: string
  onClick?: () => void
}

const MenuRow = ({ text, icon = 'iconamoon:arrow-right-2', onClick }: MenuRowProps) => {
  return (
    <button
      type="button"
      className={style.menurow}
      onClick={onClick}
    >
      <div className={style.menurow__text}>
        {text}
      </div>
      <Icon
        icon={icon}
        className={style.menurow__icon}
      />
    </button>
  )
}

export default MenuRow