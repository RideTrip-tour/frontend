import { useMemo, useCallback } from 'react';

import { WEEKDAY_LABELS_SHORT } from '@/shared/ui/compose/DateRangePicker/constants.ts';
import DayCell from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarGrid/DayCell';
import WeekdayHeaderCell from '@/shared/ui/compose/DateRangePicker/DateRangePickerModal/Calendar/CalendarGrid/WeekdayHeaderCell';
import type { DayCellFlags, SelectionTab } from '@/shared/ui/compose/DateRangePicker/types.ts';
import { areSameDay, buildCalendarCells } from '@/shared/ui/compose/DateRangePicker/utils.ts';

import style from './calendargrid.module.scss';


interface CalendarGridProps {
  readonly displayYear: number;
  readonly displayMonth: number;
  readonly selectionFrom: Date | null;
  readonly selectionTo: Date | null;
  readonly activeTab: SelectionTab;
  readonly today: Date;
  readonly onDayClick: (date: Date) => void;
}

function CalendarGrid({
  displayYear,
  displayMonth,
  selectionFrom,
  selectionTo,
  activeTab,
  today,
  onDayClick,
}: Readonly<CalendarGridProps>) {
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

      const isDimmed = !!(activeTab === 'to' && selectionFrom && date < selectionFrom);

      let isDisabled: boolean;

      if (activeTab === 'from') {
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
        isDimmed,
      };
    },
    [selectionFrom, selectionTo, activeTab, today],
  );

return (
    <div className={style.calendargrid}>
      <div className={style.calendargrid__weekdays}>
        {WEEKDAY_LABELS_SHORT.map((label) => (
          <WeekdayHeaderCell key={label} label={label} />
        ))}
      </div>

      <div className={style.calendargrid__days}>
        {cells.map((date) =>
          date ? (
            <DayCell
              key={date.toISOString()}
              date={date}
              flags={computeFlags(date)}
              onClick={onDayClick}
            />
          ) : (
            <div
              key={`empty-${date.toISOString()}`}
              className={style.calendargrid__empty}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default CalendarGrid;

