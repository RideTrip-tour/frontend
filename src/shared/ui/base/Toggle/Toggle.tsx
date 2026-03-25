import { useState } from 'react'
import style from './toggle.module.scss'
import './variables.css'

interface ToggleProps {
  name: string
  onEnable?: () => void
  onDisable?: () => void
  defaultOn?: boolean
}

const Toggle = ({
                  name,
                  onEnable,
                  onDisable,
                  defaultOn = false
                }: ToggleProps) => {
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

  return (
    <div
      className={classes}
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
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

export default Toggle