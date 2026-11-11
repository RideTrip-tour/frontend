import { formatResultCount } from '@/widgets/travel-constructor';

const pluralRules = new Intl.PluralRules('ru-RU');
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const dateWithYearFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatSimilarResultCount(count: number) {
  const adjective = pluralRules.select(count) === 'one' ? 'похожий' : 'похожих';
  return formatResultCount(count).replace('вариант', `${adjective} вариант`);
}

export function formatSearchDate(date: Date | null) {
  if (!date) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateRange(
  departureDate: Date | null,
  returnDate: Date | null,
): string | undefined {
  if (!departureDate || !returnDate) {
    const selectedDate = departureDate ?? returnDate;
    return selectedDate ? dateFormatter.format(selectedDate) : undefined;
  }

  if (departureDate.getFullYear() !== returnDate.getFullYear()) {
    return `${dateWithYearFormatter.format(departureDate)} – ${dateWithYearFormatter.format(returnDate)}`;
  }

  const departure =
    departureDate.getMonth() === returnDate.getMonth()
      ? departureDate.getDate()
      : dateFormatter.format(departureDate);

  return `${departure} – ${dateFormatter.format(returnDate)}`;
}

function getCalendarDayTimestamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatNightCount(
  departureDate: Date | null,
  returnDate: Date | null,
): string | undefined {
  if (!departureDate || !returnDate) {
    return undefined;
  }

  const nights =
    (getCalendarDayTimestamp(returnDate) - getCalendarDayTimestamp(departureDate)) /
    MILLISECONDS_PER_DAY;

  if (nights < 0) {
    return undefined;
  }

  const plural = pluralRules.select(nights);
  const noun = plural === 'one' ? 'ночь' : plural === 'few' ? 'ночи' : 'ночей';
  return `${nights} ${noun}`;
}
