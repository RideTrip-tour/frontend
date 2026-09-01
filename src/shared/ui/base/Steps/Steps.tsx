import style from './steps.module.scss'
import './variables.css'
import {Icon} from '@iconify/react'

interface StepData {
  title: string
  text: string
}

interface StepsProps {
  steps: Record<number, StepData>
  onCtaClick?: () => void
  ctaText?: string
}

const Steps = ({steps, onCtaClick, ctaText = 'Начнём подбор'}: StepsProps) => {
  const entries = Object.entries(steps).map(([key, val]) => ({
    number: Number(key),
    ...val
  }))

  return (
    <div className={style.steps}>

      <div className={style.steps__header}>
        <img
          className={style.steps__connector}
          src="/assets/images/pages/home/home-page-arrow.svg"
          alt=""
        />

        <div className={style.steps__row}>
          {entries.map(({number}) => (
            <div key={number}
                 className={style.steps__col}
            >
              <div className={style.steps__dot}>
                <span className={style.steps__dot_value}>{number}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={style.steps__row}>
          {entries.map(({number, title, text}) => (
            <div key={number}
                 className={style.steps__col}
            >
              <div className={style.steps__card}>
                <div className={style.steps__title}>{title}</div>
                <div className={style.steps__text}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {onCtaClick && (
        <button
          className={style.steps__cta}
          onClick={onCtaClick}
        >
          <span className={style.steps__cta_text}>{ctaText}</span>
          <Icon
            className={style.steps__cta_icon}
            icon="material-symbols:arrow-downward-rounded"
          />
        </button>
      )}

    </div>
  )
}

export default Steps