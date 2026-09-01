import { useState } from 'react'
import style from './actiontoggle.module.scss'

interface ActionToggleProps {
  iconDefault: string
  iconActive: string
  tooltip: string
  active?: boolean
  onToggle?: (state: boolean) => void
}

const ActionToggle = ({
                        iconDefault,
                        iconActive,
                        tooltip,
                        active = false,
                        onToggle
                      }: ActionToggleProps) => {

  const [isActive, setIsActive] = useState(active)

  const handleClick = () => {
    const newState = !isActive
    setIsActive(newState)
    onToggle?.(newState)
  }

  const classes = [
    style.actiontoggle,
    isActive ? style['actiontoggle--active'] : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={handleClick}>

      <div className={style.actiontoggle__iconWrapper}>

        <img
          src={iconDefault}
          className={`${style.actiontoggle__icon} ${style.actiontoggle__iconDefault}`}
          alt=""
        />

        <img
          src={iconActive}
          className={`${style.actiontoggle__icon} ${style.actiontoggle__iconActive}`}
          alt=""
        />

      </div>

      <div className={style.actiontoggle__tooltip}>
        {tooltip}
      </div>

    </div>
  )
}

export default ActionToggle