import style from './calendarheader.module.scss'
import './variables.css'

import { MONTH_LABELS_RU } from '@/shared/ui/DateRangePicker/constants.ts'

interface CalendarHeaderProps {
  displayYear: number
  displayMonth: number
  isPrevMonthDisabled: boolean
  isNextMonthDisabled: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
  onOpenDrumPicker: () => void
}

export function CalendarHeader({
                                 displayYear,
                                 displayMonth,
                                 isPrevMonthDisabled,
                                 isNextMonthDisabled,
                                 onPrevMonth,
                                 onNextMonth,
                                 onOpenDrumPicker,
                               }: CalendarHeaderProps) {

  const prevBtnClass = [
    style.calendarheader__navButton,
    isPrevMonthDisabled && style['calendarheader__navButton--disabled']
  ].filter(Boolean).join(' ')

  const nextBtnClass = [
    style.calendarheader__navButton,
    isNextMonthDisabled && style['calendarheader__navButton--disabled']
  ].filter(Boolean).join(' ')

  return (
    <div className={style.calendarheader}>

      <button
        className={prevBtnClass}
        onClick={onPrevMonth}
        disabled={isPrevMonthDisabled}
        aria-label="Предыдущий месяц"
      >
        ‹
      </button>

      <div className={style.calendarheader__center}>
        <span
          className={style.calendarheader__title}
          onClick={onOpenDrumPicker}
        >
          {MONTH_LABELS_RU[displayMonth]} {displayYear}
        </span>

        <div className={style.calendarheader__arrows}>
          {(["▲", "▼"] as const).map((arrow) => (
            <button
              key={arrow}
              onClick={onOpenDrumPicker}
              aria-label="Открыть выбор месяца и года"
              className={style.calendarheader__arrowButton}
            >
              {arrow}
            </button>
          ))}
        </div>
      </div>

      <button
        className={nextBtnClass}
        onClick={onNextMonth}
        disabled={isNextMonthDisabled}
        aria-label="Следующий месяц"
      >
        ›
      </button>

    </div>
  )
}