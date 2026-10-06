const tripDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});

const cartDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  // year: 'numeric', //Раскомментировать если понадобится год в датах
});

export const priceFormatter = new Intl.NumberFormat('ru-RU');

export function formatTripDates(
  departureDate: Date | null,
  returnDate: Date | null,
): string | undefined {
  if (!departureDate) {
    return undefined;
  }

  const departure = tripDateFormatter.format(departureDate);

  return returnDate
    ? `${departure} — ${tripDateFormatter.format(returnDate)}`
    : `${departure} — выберите дату возвращения`;
}

export function formatCartDate(date: Date) {
  return cartDateFormatter.format(date);
}

export function formatPrice(price: number) {
  return `${priceFormatter.format(price)} ₽`;
}

export function formatResultCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} вариантов`;
  }

  if (lastDigit === 1) {
    return `${count} вариант`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} варианта`;
  }

  return `${count} вариантов`;
}
