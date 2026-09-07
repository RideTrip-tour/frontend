import style from './textlink.module.scss'
import './variables.css'

interface TextLinkProps {
  text: string
  to: string
  fontSize?: number
}

const TextLink = ({ text, to, fontSize = 14 }: TextLinkProps) => {
  const handleClick = () => {
    window.open(to, '_blank', 'noopener,noreferrer')
  }

  return (
    <span
      className={style.textlink}
      onClick={handleClick}
      role="link"
      style={{ fontSize }}
    >
      {text}
    </span>
  )
}

export default TextLink