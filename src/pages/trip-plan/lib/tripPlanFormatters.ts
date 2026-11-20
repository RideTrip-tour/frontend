import { toTripPlanDate } from '@/entities/trip-plan';

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

const pluralRules = new Intl.PluralRules('ru-RU');

export function plural(value: number, one: string, few: string, many: string) {
  const form = pluralRules.select(value);
  if (form === 'one') return `${value} ${one}`;
  if (form === 'few') return `${value} ${few}`;
  return `${value} ${many}`;
}

export function formatNumber(value: number): string {
  return money.format(value);
}

export function price(value: number) {
  return `${formatNumber(value)} ₽`;
}

export function formatDate(date: Date | null) {
  return date && Number.isFinite(date.getTime()) ? dateFormatter.format(date) : 'Дата не выбрана';
}

export function formatDateRange(from: Date | null, to: Date | null): string {
  if (!from && !to) return 'Даты поездки не выбраны';
  if (
    from &&
    to &&
    Number.isFinite(from.getTime()) &&
    Number.isFinite(to.getTime()) &&
    from.getFullYear() === to.getFullYear() &&
    from.getMonth() === to.getMonth()
  ) {
    return `${from.getDate()} – ${formatDate(to)}`;
  }
  return `${formatDate(from)} – ${formatDate(to)}`;
}

export function calendarDate(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return toTripPlanDate(date) === value ? date : null;
}

export function time(value: string | undefined): string | undefined {
  return value && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined;
}

export function amount(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

export function getTripNightCount(departure: Date | null, arrival: Date | null): number | null {
  if (!toTripPlanDate(departure) || !toTripPlanDate(arrival) || !departure || !arrival) return null;
  const nights =
    (Date.UTC(arrival.getFullYear(), arrival.getMonth(), arrival.getDate()) -
      Date.UTC(departure.getFullYear(), departure.getMonth(), departure.getDate())) /
    86_400_000;
  return nights > 0 ? nights : null;
}
