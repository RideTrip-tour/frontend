import './variables.css'
import style from './inforow.module.scss'

interface InfoRowProps {
  label: string
  value: string
  actionText?: string
  onAction?: () => void
}

const InfoRow = ({ label, value, actionText, onAction }: InfoRowProps) => {
  return (
    <div className={style.inforow}>
      <div className={style.inforow__label}>
        {label}
      </div>
      <div className={style.inforow__content}>
        <div className={style.inforow__value}>
          {value}
        </div>
        {actionText && (
          <button
            type="button"
            className={style.inforow__action}
            onClick={onAction}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

export default InfoRow