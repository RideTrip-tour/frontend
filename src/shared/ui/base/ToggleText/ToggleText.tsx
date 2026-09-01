import { useState, type CSSProperties } from 'react'
import style from './toggle-text.module.scss'
import './variables.css'

interface ToggleTextProps {
  name: string
  onEnable?: () => void
  onDisable?: () => void
  defaultOn?: boolean
  width?: number
}

const ToggleText = ({
                      name,
                      onEnable,
                      onDisable,
                      defaultOn = false,
                      width
                    }: ToggleTextProps) => {
  const [isOn, setIsOn] = useState(defaultOn)

  const handleToggle = () => {
    setIsOn(prev => {
      const next = !prev
      if (next) {
        onEnable?.()
      } else {
        onDisable?.()
      }
      return next
    })
  }

  const classes = [
    style.toggle,
    isOn ? style['toggle--active'] : ''
  ].filter(Boolean).join(' ')

  const customStyles: CSSProperties = {
    '--toggle-width': width !== undefined ? `${width}px` : 'fit-content'
  } as CSSProperties

  return (
    <div
      className={classes}
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      style={customStyles}
    >
      <div className={style.toggle__content}>
        <div className={style.toggle__content__title}>
          <div className={style.toggle__content__title_text}>
            {name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToggleText