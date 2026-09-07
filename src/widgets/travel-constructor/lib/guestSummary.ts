import type { GuestSelection } from '@/widgets/travel-constructor/model/types';

function pluralize(
  value: number,
  forms: [singular: string, paucal: string, plural: string],
) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2];
  }

  if (lastDigit === 1) {
    return forms[0];
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }

  return forms[2];
}

export function getGuestCounts(selection: GuestSelection) {
  return {
    adults: selection.adults,
    children: selection.children,
  };
}

export function formatGuestSummary(selection: GuestSelection) {
  const { adults, children } = getGuestCounts(selection);
  const total = adults + children;
  const details = [
    `${adults} ${pluralize(adults, ['взрослый', 'взрослых', 'взрослых'])}`,
  ];

  if (children > 0) {
    details.push(
      `${children} ${pluralize(children, ['ребёнок', 'ребёнка', 'детей'])}`,
    );
  }

  return `${total} ${pluralize(total, ['человек', 'человека', 'человек'])} (${details.join(', ')})`;
}
