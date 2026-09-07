import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import style from './skillquiz.module.scss'

const QUESTIONS = [
  {
    id: 1,
    text: 'Какой у Вас опыт катания?',
    options: ['Никогда не катался', 'Пробовал несколько раз', 'Катаюсь иногда', 'Катаюсь регулярно'],
    scores: [0, 1, 2, 3],
  },
  {
    id: 2,
    text: 'Какую сложность трасс вы обычно выбираете?',
    options: ['Только зелёные', 'Зелёные и синие', 'Синие и красные', 'Красные и чёрные', 'Катаюсь вне трасс'],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 3,
    text: 'Сколько сезонов Вы катаетесь?',
    options: ['Первый сезон', '1–2 сезона', '3–5 сезонов', 'Более 5'],
    scores: [0, 1, 2, 3],
  },
  {
    id: 4,
    text: 'Комфортно ли Вам кататься вне трасс?',
    options: ['Нет', 'Иногда', 'Да', 'Люблю фрирайд'],
    scores: [0, 1, 2, 3],
  },
  {
    id: 5,
    text: 'Готовы ли Вы к сложным маршрутам?',
    options: ['Нет, хочу спокойное катание', 'Иногда', 'Да'],
    scores: [0, 1, 2],
  },
]

const LOADING_TEXTS = [
  'Анализируем ваши ответы...',
  'Определяем уровень...',
  'Ищем идеальные туры...',
]

const LOADING_BAR_STEPS = [15, 35, 55, 72, 88, 100]

interface Level {
  label: string
  formats: string[]
  highlight: string
}

type QuizStep = 'intro' | number | 'loading' | 'result'

const getLevel = (totalScore: number): Level => {
  if (totalScore <= 2) return {
    label: '«Новичок»',
    formats: ['Подойдут зелёные трассы', 'Спокойные маршруты', 'Туры с инструкторами'],
    highlight: 'групповых туров',
  }
  if (totalScore <= 7) return {
    label: '«Средний»',
    formats: ['Зелёные и синие трассы', 'Маршруты средней сложности', 'Туры с гидом по живописным склонам'],
    highlight: 'синих трасс с гидом',
  }
  return {
    label: '«Продвинутый»',
    formats: ['Синие и красные трассы', 'Динамичные маршруты', 'Технические спуски и ски-туры'],
    highlight: 'красных трасс и ски-туров',
  }
}

interface QuizOptionProps {
  label: string
  selected: boolean
  onClick: () => void
}

const QuizOption = ({ label, selected, onClick }: QuizOptionProps) => (
  <div className={style.skillquiz__option} onClick={onClick}>
    <div className={`${style.skillquiz__option__radio} ${selected ? style['skillquiz__option__radio--selected'] : ''}`}>
      {selected && <div className={style.skillquiz__option__radio__dot} />}
    </div>
    <span className={style.skillquiz__option__label}>{label}</span>
  </div>
)

const LoadingBar = () => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < LOADING_BAR_STEPS.length) {
        setPercent(LOADING_BAR_STEPS[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 420)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={style.skillquiz__loadingbar}>
      <div className={style.skillquiz__loadingbar__track}>
        <div className={style.skillquiz__loadingbar__fill} style={{ width: `${percent}%` }} />
      </div>
      <span className={style.skillquiz__loadingbar__label}>Готово: {percent}%</span>
    </div>
  )
}

const LoadingText = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev < LOADING_TEXTS.length - 1 ? prev + 1 : prev))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={style.skillquiz__loadingtext}>
      <div className={style.skillquiz__loadingtext__title}>{LOADING_TEXTS[index]}</div>
      <div className={style.skillquiz__loadingtext__subtitle}>Подбираем варианты под вас</div>
    </div>
  )
}

const SkillQuiz = () => {
  const [visibleStep, setVisibleStep] = useState<QuizStep>('intro')
  const [isExiting, setIsExiting] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const totalQ = QUESTIONS.length
  const currentQ = typeof visibleStep === 'number' ? QUESTIONS[visibleStep - 1] : null
  const isLastQuestion = visibleStep === totalQ
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
  const level = getLevel(totalScore)

  useLayoutEffect(() => {
    if (wrapperRef.current && bodyRef.current) {
      wrapperRef.current.style.height = `${bodyRef.current.offsetHeight}px`
    }
  }, [visibleStep])

  const transitionTo = (newStep: QuizStep) => {
    setIsExiting(true)
    setTimeout(() => {
      setVisibleStep(newStep)
      setIsExiting(false)
    }, 300)
  }

  const handleStart = () => {
    setSelectedIndex(null)
    setAnswers({})
    transitionTo(1)
  }

  const handleNext = () => {
    if (selectedIndex === null || !currentQ) return
    const updatedAnswers = { ...answers, [currentQ.id]: currentQ.scores[selectedIndex] }
    setAnswers(updatedAnswers)
    if (!isLastQuestion) {
      setSelectedIndex(null)
      transitionTo((visibleStep as number) + 1)
    } else {
      transitionTo('loading')
      setTimeout(() => transitionTo('result'), 3300)
    }
  }

  const bodyClass = [
    style.skillquiz__body,
    isExiting ? style['skillquiz__body--exit'] : style['skillquiz__body--enter'],
  ].join(' ')

  return (
    <div className={style.skillquiz}>
      <div ref={wrapperRef} className={style.skillquiz__wrapper}>
        <div ref={bodyRef} className={bodyClass}>

          {visibleStep === 'intro' && (
            <div className={style.skillquiz__intro}>
              <div className={style.skillquiz__intro__texts}>
                <div className={style.skillquiz__intro__title}>Определим Ваш уровень</div>
                <div className={style.skillquiz__intro__subtitle}>
                  Ответьте на несколько вопросов — это займёт меньше минуты.
                </div>
              </div>
              <button className={style.skillquiz__button} onClick={handleStart}>
                Начать
              </button>
            </div>
          )}

          {visibleStep === 'loading' && (
            <div className={style.skillquiz__loading}>
              <img src="/assets/images/pages/profile/quiz-level.gif" alt="Загрузка" className={style.skillquiz__loading__gif} />
              <LoadingText />
              <LoadingBar />
            </div>
          )}

          {visibleStep === 'result' && (
            <div className={style.skillquiz__result}>
              <div className={style.skillquiz__result__header}>
                <div className={style.skillquiz__result__subtitle}>Мы подобрали Ваш уровень:</div>
                <div className={style.skillquiz__result__level}>{level.label}</div>
              </div>
              <div className={style.skillquiz__result__formats}>
                <div className={style.skillquiz__result__formats__title}>Подходящие форматы:</div>
                <div className={style.skillquiz__result__formats__list}>
                  {level.formats.map(format => (
                    <div key={format} className={style.skillquiz__result__formats__item}>
                      <Icon icon="material-symbols:check" className={style.skillquiz__result__formats__icon} />
                      <span>{format}</span>
                    </div>
                  ))}
                  <div className={style.skillquiz__result__formats__highlight}>
                    Лучше всего начать с{' '}
                    <span className={style.skillquiz__result__formats__accent}>{level.highlight}</span>
                  </div>
                </div>
              </div>
              <div className={style.skillquiz__result__actions}>
                <button className={style.skillquiz__button} onClick={() => alert('Смотреть варианты')}>
                  Смотреть варианты
                </button>
                <span className={style.skillquiz__result__actions__note}>Ваши навыки подтверждены</span>
              </div>
            </div>
          )}

          {typeof visibleStep === 'number' && currentQ && (
            <div className={style.skillquiz__question}>
              <div className={style.skillquiz__question__counter}>
                Вопрос {visibleStep} из {totalQ}
              </div>
              <div className={style.skillquiz__question__text}>{currentQ.text}</div>
              <div className={style.skillquiz__question__options}>
                {currentQ.options.map((option, index) => (
                  <QuizOption
                    key={index}
                    label={option}
                    selected={selectedIndex === index}
                    onClick={() => setSelectedIndex(index)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {typeof visibleStep === 'number' && (
        <div className={style.skillquiz__actions}>
          <button
            className={`${style.skillquiz__button} ${selectedIndex === null ? style['skillquiz__button--disabled'] : ''}`}
            onClick={handleNext}
            disabled={selectedIndex === null}
          >
            {isLastQuestion ? 'Узнать уровень' : 'Далее'}
            {!isLastQuestion && <Icon icon="material-symbols:arrow-forward-rounded" width="18" />}
          </button>
        </div>
      )}
    </div>
  )
}

export default SkillQuiz