import { useState } from 'react';
import {
  Calendar,
  type CalendarDateRange,
} from '@/shared/ui/base/Calendar';
import styles from './DateRangePicker.module.scss';

interface DateRangePickerProps {
  departureDate: Date | null;
  returnDate: Date | null;
  onChange: (range: CalendarDateRange) => void;
  onComplete?: (range: { from: Date; to: Date }) => void;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function DateRangePicker({
  departureDate,
  returnDate,
  onChange,
  onComplete,
}: DateRangePickerProps) {
  const today = startOfDay(new Date());
  const currentMonthStart = startOfMonth(today);
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(departureDate ?? today),
  );

  const nextMonth = addMonths(currentMonth, 1);
  const previousMonth = addMonths(currentMonth, -1);
  const canGoToPreviousMonth = previousMonth >= currentMonthStart;

  const selectedRange: CalendarDateRange = {
    from: departureDate,
    to: returnDate,
  };

  const handleSelect = (selectedDate: Date) => {
    const date = startOfDay(selectedDate);

    if (!departureDate || returnDate) {
      onChange({ from: date, to: null });
      return;
    }

    const range: { from: Date; to: Date } =
      date < startOfDay(departureDate)
        ? { from: date, to: startOfDay(departureDate) }
        : { from: startOfDay(departureDate), to: date };

    onChange(range);
    onComplete?.(range);
  };

  return (
    <div className={styles.dateRangePicker}>
      <div className={styles.calendars}>
        <Calendar
          month={currentMonth}
          selectedRange={selectedRange}
          minDate={today}
          onSelect={handleSelect}
          onPreviousMonth={() => setCurrentMonth(previousMonth)}
          previousMonthDisabled={!canGoToPreviousMonth}
        />

        <Calendar
          month={nextMonth}
          selectedRange={selectedRange}
          minDate={today}
          onSelect={handleSelect}
          onNextMonth={() => setCurrentMonth(nextMonth)}
        />
      </div>
    </div>
  );
}
