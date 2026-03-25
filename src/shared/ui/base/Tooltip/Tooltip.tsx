import { ReactNode, useState } from 'react'
import './variables.css'
import style from './tooltip.module.scss'

interface TooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: ReactNode
}

const Tooltip = ({
                   text,
                   position = 'top',
                   children
                 }: TooltipProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={style.tooltip}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className={`${style.tooltip__content} ${style[`tooltip__content--${position}`]}`}>
          {text}
          <span className={style.tooltip__arrow} />
        </div>
      )}
    </div>
  )
}

export default Tooltip