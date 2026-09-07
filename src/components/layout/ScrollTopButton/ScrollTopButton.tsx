import {Icon} from '@iconify/react'
import style from './scrolltopbutton.module.scss'

const ScrollTopButton = () => {
  const handleClick = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <button
      type="button"
      className={style.scrollTopButton}
      onClick={handleClick}
      aria-label="Наверх"
    >
      <Icon icon="iconamoon:arrow-up-2" />
    </button>
  )
}

export default ScrollTopButton