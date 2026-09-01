import { useState } from 'react'
import './variables.css'
import style from './triposetoggle.module.scss'

type TriState = 'default' | 'included' | 'excluded'

interface TriPoseToggleProps {
  text: string
  includedIcon: string
  excludedIcon: string
  onDefault?: () => void
  onIncluded?: () => void
  onExcluded?: () => void
}

const TriPoseToggle = ({
                         text,
                         includedIcon,
                         excludedIcon,
                         onDefault,
                         onIncluded,
                         onExcluded
                       }: TriPoseToggleProps) => {
  const [state, setState] = useState<TriState>('default')

  const handleClick = () => {
    const nextState =
      state === 'default'
        ? 'included'
        : state === 'included'
          ? 'excluded'
          : 'default'

    setState(nextState)

    if (nextState === 'default') onDefault?.()
    else if (nextState === 'included') onIncluded?.()
    else onExcluded?.()
  }

  const iconSrc =
    state === 'included'
      ? includedIcon
      : state === 'excluded'
        ? excludedIcon
        : null

  return (
    <div
      className={`${style.triposetoggle} ${style[`triposetoggle--${state}`]}`}
      onClick={handleClick}
      role="button"
      aria-pressed={state !== 'default'}
    >
      <div className={style.triposetoggle__content}>
        <div className={style.triposetoggle__text}>
          {text}
        </div>

        {iconSrc && (
          <img
            src={iconSrc}
            className={style.triposetoggle__icon}
            alt=""
          />
        )}
      </div>
    </div>
  )
}

export default TriPoseToggle