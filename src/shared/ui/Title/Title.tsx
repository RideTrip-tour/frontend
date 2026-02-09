import style from './componentblocktitle.module.scss'
import './variables.css'

interface TitleProps {
  text: string
}

const Title = ({ text }: TitleProps) => {
  return (
    <div className={style.componentblocktitle}>
      <span className={style.componentblocktitle_text}>
        {text}
      </span>
    </div>
  )
}

export default Title