import styles from './Calendar.module.scss';

export interface CalendarDateRange {
  from: Date | null;
  to: Date | null;
}

interface CalendarProps {
  month: Date;
  selectedRange: CalendarDateRange;
  minDate?: Date;
  onSelect: (date: Date) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  previousMonthDisabled?: boolean;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  // year: 'numeric', // Если понадобится год
});

const dayFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(first: Date, second: Date): boolean {
  return startOfDay(first).getTime() === startOfDay(second).getTime();
}

function getMonthDays(month: Date): Array<Date | null> {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const mondayBasedOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - mondayBasedOffset + 1;

    if (day < 1 || day > daysInMonth) {
      return null;
    }

    return new Date(year, monthIndex, day);
  });
}

export function Calendar({
  month,
  selectedRange,
  minDate,
  onSelect,
  onPreviousMonth,
  onNextMonth,
  previousMonthDisabled = false,
}: CalendarProps) {
  const days = getMonthDays(month);
  const normalizedMinDate = minDate ? startOfDay(minDate) : null;
  const rangeStart = selectedRange.from
    ? startOfDay(selectedRange.from)
    : null;
  const rangeEnd = selectedRange.to ? startOfDay(selectedRange.to) : null;
  const hasCompleteRange = Boolean(rangeStart && rangeEnd);
  const monthLabel = monthFormatter.format(month);

  return (
    <section className={styles.calendar} aria-label={`Календарь: ${monthLabel}`}>
      <div className={styles.monthHeader}>
        {onPreviousMonth && (
          <button
            type="button"
            className={`${styles.navigationButton} ${styles.previousButton}`}
            disabled={previousMonthDisabled}
            aria-label="Предыдущий месяц"
            onClick={onPreviousMonth}
          >
            ‹
          </button>
        )}

        <h3 className={styles.monthTitle}>{monthLabel}</h3>

        {onNextMonth && (
          <button
            type="button"
            className={`${styles.navigationButton} ${styles.nextButton}`}
            aria-label="Следующий месяц"
            onClick={onNextMonth}
          >
            ›
          </button>
        )}
      </div>

      <div className={styles.weekdays} aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className={styles.weekday}>
            {weekday}
          </span>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className={styles.emptyDay} />;
          }

          const normalizedDate = startOfDay(date);
          const isRangeStart = Boolean(
            rangeStart && isSameDay(normalizedDate, rangeStart),
          );
          const isRangeEnd = Boolean(
            rangeEnd && isSameDay(normalizedDate, rangeEnd),
          );
          const isInRange = Boolean(
            rangeStart &&
              rangeEnd &&
              normalizedDate.getTime() > rangeStart.getTime() &&
              normalizedDate.getTime() < rangeEnd.getTime(),
          );
          const isDisabled = Boolean(
            normalizedMinDate && normalizedDate < normalizedMinDate,
          );
          const isToday = isSameDay(normalizedDate, new Date());
          const isWeekStart = isInRange && index % 7 === 0;
          const isWeekEnd = isInRange && index % 7 === 6;

          const isMonthStart = isInRange && date.getDate() === 1;

          const isMonthEnd =
            isInRange &&
            date.getDate() ===
              new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

          const cellClassName = [
            styles.dayCell,
            isInRange && styles.inRange,
            hasCompleteRange && isRangeStart && styles.rangeStart,
            hasCompleteRange && isRangeEnd && styles.rangeEnd,
            isWeekStart && styles.weekStart,
            isWeekEnd && styles.weekEnd,
            isMonthStart && styles.monthStart,
            isMonthEnd && styles.monthEnd,
          ]
            .filter(Boolean)
            .join(' ');

          const buttonClassName = [
            styles.dayButton,
            (isRangeStart || isRangeEnd) && styles.selectedDay,
            isToday && !isRangeStart && !isRangeEnd && styles.today,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <span key={date.toISOString()} className={cellClassName}>
              <button
                type="button"
                className={buttonClassName}
                disabled={isDisabled}
                aria-label={dayFormatter.format(date)}
                aria-pressed={isRangeStart || isRangeEnd}
                onClick={() => onSelect(date)}
              >
                {date.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </section>
  );
}