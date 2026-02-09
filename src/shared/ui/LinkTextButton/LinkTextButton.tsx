import './variables.css'
import style from './linkbutton.module.scss'

interface LinkButtonProps {
  text: string
  link: string
  iconSrc?: string
}

const LinkButton = ({ text, link, iconSrc }: LinkButtonProps) => {
  const handleClick = () => {
    window.location.href = link
  }

  return (
    <div className={style.linkbutton}>
      <div
        className={style.linkbutton__content}
        onClick={handleClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleClick()
        }}
      >
        <div className={style.linkbutton__content__title}>
          <div className={style.linkbutton__content__title_text}>
            {text}
          </div>
        </div>

        <div className={style.linkbutton__content__icon}>
          {iconSrc && (
            <img
              src={iconSrc}
              alt="icon"
              className={style.linkbutton__content__icon_img}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default LinkButton
