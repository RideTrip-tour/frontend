import type { TripPlanPageData } from '../model/types';

export function formatTripPlanForSharing(plan: TripPlanPageData): string {
  const services = [
    ['Билеты', plan.tickets],
    ['Проживание', plan.accommodation],
    ['Трансфер', plan.transfer],
  ] as const;
  return [
    `План поездки: ${plan.title}`,
    plan.subtitle,
    ...plan.badges.map((badge) => badge.text),
    '',
    ...services.flatMap(([title, service]) => [
      title,
      ...service.fields.map((field) => {
        const note = field.note ? ` (${field.note})` : '';
        return `${field.label}: ${field.value}${note}`;
      }),
      [service.footer, service.footerPhone].filter(Boolean).join(' • '),
      '',
    ]),
    'Состав поездки',
    ...plan.travelers.map((traveler) => `${traveler.label} — ${traveler.description}`),
    ...(plan.additional?.length ? [`Пожелания: ${plan.additional.join(', ')}`] : []),
    '',
    ...plan.costs.map((cost) => `${cost.label}: ${cost.amount}`),
    `Предварительный итог: ${plan.totalLabel}`,
    plan.totalNote,
    `Итого за 1 человека: ${plan.perPersonTotalLabel}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}
