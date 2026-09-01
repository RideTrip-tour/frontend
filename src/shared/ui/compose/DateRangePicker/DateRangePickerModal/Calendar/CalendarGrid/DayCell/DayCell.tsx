import style from './daycell.module.scss'
import './variables.css'
import type { DayCellFlags } from '@/shared/ui/compose/DateRangePicker/types.ts'

interface DayCellProps {
  date: Date
  flags: DayCellFlags
  onClick: (date: Date) => void
}

function DayCell({ date, flags, onClick }: DayCellProps) {
  const {
    isToday,
    isWeekend,
    isDisabled,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isDimmed,
  } = flags

  const className = [
    style.daycell,
    isSelected && style.selected,
    isInRange && !isSelected && style.inRange,
    isRangeStart && style.rangeStart,
    isRangeEnd && style.rangeEnd,
    isToday && !isSelected && style.today,
    isWeekend && !isSelected && style.weekend,
    isDisabled && style.disabled,
    isDimmed && style.dimmed,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      onClick={() => !isDisabled && onClick(date)}
    >
      {date.getDate()}
    </div>
  )
}

export default DayCell