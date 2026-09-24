import style from './textlink.module.scss'
import './variables.css'

interface TextLinkProps {
  text: string
  to: string
  fontSize?: number
}

const TextLink = ({ text, to, fontSize = 14 }: TextLinkProps) => {
  return (
    <a
      className={style.textlink}
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontSize }}
    >
      {text}
    </a>
  )
}

export default TextLink