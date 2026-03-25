import style from './steps.module.scss'
import './variables.css'

interface StepData {
  title: string
  text: string
}

interface StepsProps {
  steps: Record<number, StepData>
}

const Steps = ({ steps }: StepsProps) => {
  const entries = Object.entries(steps).map(([key, val]) => ({
    number: Number(key),
    ...val
  }))

  return (
    <div className={style.steps}>

      <div className={style.steps__row}>

        <div className={style.steps__line} />
        <div className={style.steps__arrow}>
          <svg viewBox="0 0 24 24">
            <path d="M4 12h16M16 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
            />
          </svg>
        </div>
        {entries.map(({number, title, text}) => (
          <div key={number}
               className={style.steps__col}
          >

            <div className={style.steps__dot}>{number}</div>

            <div className={style.steps__title}>{title}</div>
            <div className={style.steps__text}>{text}</div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Steps