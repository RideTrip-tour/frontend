import style from './calendargrid.module.scss'
import './variables.css'
import { useMemo, useCallback } from "react";
import type { DayCellFlags, SelectionTab } from '@/shared/ui/compose/DateRangePicker/types.ts'
import { areSameDay, buildCalendarCells } from '@/shared/ui/compose/DateRangePicker/utils.ts'
import { WEEKDAY_LABELS_SHORT } from '@/shared/ui/compose/DateRangePicker/constants.ts'

import {
  WeekdayHeaderCell
} from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarGrid/WeekdayHeaderCell/WeekdayHeaderCell.tsx'

import {
  DayCell
} from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarGrid/DayCell/DayCell.tsx'

interface CalendarGridProps {
  displayYear: number
  displayMonth: number
  selectionFrom: Date | null
  selectionTo: Date | null
  activeTab: SelectionTab
  today: Date
  onDayClick: (date: Date) => void
}

export function CalendarGrid({
                               displayYear,
                               displayMonth,
                               selectionFrom,
                               selectionTo,
                               activeTab,
                               today,
                               onDayClick,
                             }: CalendarGridProps) {

  const cells = useMemo(
    () => buildCalendarCells(displayYear, displayMonth),
    [displayYear, displayMonth],
  );

  const computeFlags = useCallback(
    (date: Date): DayCellFlags => {
      const dayOfWeek = date.getDay();

      const isToday = areSameDay(date, today);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const isRangeStart = !!(selectionFrom && areSameDay(date, selectionFrom));
      const isRangeEnd = !!(selectionTo && areSameDay(date, selectionTo));
      const isSelected = isRangeStart || isRangeEnd;

      const isInRange = !!(
        selectionFrom &&
        selectionTo &&
        date > selectionFrom &&
        date < selectionTo
      );

      const isDimmed = !!(
        activeTab === "to" &&
        selectionFrom &&
        date < selectionFrom
      );

      let isDisabled: boolean;

      if (activeTab === "from") {
        isDisabled = date < today;
      } else {
        isDisabled = selectionFrom ? date < selectionFrom : date < today;
      }

      return {
        isToday,
        isWeekend,
        isDisabled,
        isSelected,
        isRangeStart,
        isRangeEnd,
        isInRange,
        isDimmed
      };
    },
    [selectionFrom, selectionTo, activeTab, today],
  );

  return (
    <div className={style.calendargrid}>

      <div className={style.calendargrid__weekdays}>
        {WEEKDAY_LABELS_SHORT.map((label) => (
          <WeekdayHeaderCell label={label} />
        ))}
      </div>

      <div className={style.calendargrid__days}>
        {cells.map((date, cellIndex) =>
          date ? (
            <DayCell
              date={date}
              flags={computeFlags(date)}
              onClick={onDayClick}
            />
          ) : (
            <div
              key={`empty-${cellIndex}`}
              className={style.calendargrid__empty}
            />
          )
        )}
      </div>

    </div>
  );
}