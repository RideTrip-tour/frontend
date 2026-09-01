import {type ReactNode, useState } from 'react'
import './variables.css'
import style from './tooltip.module.scss'

interface TooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  visible?: boolean
  children: ReactNode
}

const Tooltip = ({
                   text,
                   position = 'top',
                   visible,
                   children
                 }: TooltipProps) => {
  const [hoverVisible, setHoverVisible] = useState(false)

  const isVisible = visible === true || (visible === undefined && hoverVisible)

  return (
    <div
      className={style.tooltip}
      onMouseEnter={() => setHoverVisible(true)}
      onMouseLeave={() => setHoverVisible(false)}
    >
      {children}

      {isVisible && (
        <div className={`${style.tooltip__content} ${style[`tooltip__content--${position}`]}`}>
          {text}
        </div>
      )}
    </div>
  )
}

export default Tooltip