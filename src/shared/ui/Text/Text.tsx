import style from './componentblocktext.module.scss'
import './variables.css'

interface ComponentBlockTextProps {
  text: string
  color?: string
  maxLines?: number
  size?: string
}

const ComponentBlockText = ({
                              text,
                              color = '',
                              maxLines = 2,
                              size = '14px'
                            }: ComponentBlockTextProps) => {
  return (
    <div className={style.componentblocktext}>
      <span
        className={style.componentblocktext_text}
        style={{
          color,
          fontSize: size,
          WebkitLineClamp: maxLines
        }}
      >
        {text}
      </span>
    </div>
  )
}

export default ComponentBlockText