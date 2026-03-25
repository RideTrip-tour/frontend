import style from './errormessage.module.scss'
import './variables.css'

interface ErrorMessageProps {
  message: string
  visible?: boolean
}

const ErrorMessage = ({message, visible = true}: ErrorMessageProps) => {
  if (!visible) return null

  return (
    <div className={style.errormessage}>
      <div className={style.errormessage_text}>
        {message}
      </div>
    </div>
  )
}

export default ErrorMessage
