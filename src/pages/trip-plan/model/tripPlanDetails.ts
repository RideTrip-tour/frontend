import type { TripPlanAccommodationOffer } from '@/entities/trip-plan';
import {
  type ConstructorState,
  type GuestSelection,
  normalizeGuestSelection,
} from '@/widgets/travel-constructor';

import {
  amount,
  formatDateRange,
  formatNumber,
  getTripNightCount,
  plural,
} from '../lib/tripPlanFormatters';
import type { TripDetails, TripGuestInfo, TripPlanPageData, TripPrices } from './types';

function accommodationBadge(
  accommodation: {
    name: string;
    accommodationType?: string;
    rating?: number;
    minRating?: number;
  },
  requestedMinRating?: number,
): string {
  const kindFromName =
    /^(Отель|Гостиница|Санаторий|Апартаменты|Хостел|Гостевой дом|Квартира|Пентхаус)(?:\s|[«"“]|$)/i.exec(
      accommodation.name,
    )?.[1];
  const kind = accommodation.accommodationType || kindFromName || 'Проживание';
  const minRating = amount(requestedMinRating ?? accommodation.minRating);
  const rating = minRating ?? amount(accommodation.rating);
  if (rating === null || rating <= 0) return kind;
  const ratingSuffix = minRating !== null ? '+' : '';
  return `${kind} ${formatNumber(rating)}${ratingSuffix}`;
}

export function buildGuestInfo(selection: GuestSelection | null): TripGuestInfo {
  const people = normalizeGuestSelection(selection);
  if (!people) {
    return { people, count: null, label: 'Состав группы не выбран', priceLabel: '' };
  }

  const labels: string[] = [];
  const priceLabels: string[] = [];
  if (people.adults) {
    labels.push(plural(people.adults, 'взрослый', 'взрослых', 'взрослых'));
    priceLabels.push(plural(people.adults, 'взрослого', 'взрослых', 'взрослых'));
  }
  if (people.children) {
    labels.push(plural(people.children, 'ребёнок', 'ребёнка', 'детей'));
    priceLabels.push(plural(people.children, 'ребёнка', 'детей', 'детей'));
  }
  return {
    people,
    count: people.adults + people.children,
    label: labels.join('; '),
    priceLabel: priceLabels.join(' и '),
  };
}

export function buildTripDetails(trip: ConstructorState): TripDetails {
  const resort = trip.selectedResort;
  const destination = resort?.name ?? trip.toCity?.name ?? trip.toCountry?.name;
  const country = resort?.country ?? trip.toCountry?.name;
  const title = [destination, country !== destination ? country : null].filter(Boolean).join(', ');
  const origin = trip.fromCity?.name ?? trip.fromCountry?.name ?? 'Город отправления не выбран';
  const arrival =
    resort?.details.airport?.name ?? trip.toCity?.name ?? destination ?? 'Направление не выбрано';
  const nights = getTripNightCount(trip.departureDate, trip.returnDate);
  const nightLabel =
    nights === null ? 'Количество ночей не рассчитано' : plural(nights, 'ночь', 'ночи', 'ночей');
  return {
    title: title || 'План поездки',
    destination,
    origin,
    arrival,
    nights,
    nightLabel,
    dateRange: formatDateRange(trip.departureDate, trip.returnDate),
  };
}

export function buildTripHeader(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  guests: TripGuestInfo,
  details: TripDetails,
  prices: TripPrices,
) {
  const hotelDetails = selectedOffer ?? trip.accommodation;
  const badges: TripPlanPageData['badges'] = [];
  if (guests.people) badges.push({ icon: 'people', text: guests.label });
  if (hotelDetails)
    badges.push({
      icon: 'hotel',
      text: accommodationBadge(hotelDetails, trip.accommodation?.minRating),
    });
  if (trip.transfer) badges.push({ icon: 'transfer', text: trip.transfer.label });
  const activities = [...trip.activities, ...trip.liftTypes];
  return {
    title: details.title,
    subtitle: [
      details.dateRange,
      details.nights === null ? null : details.nightLabel,
      activities.join(', ') || null,
    ]
      .filter(Boolean)
      .join(' • '),
    badges,
    totalLabel: prices.totalLabel,
    totalNote: guests.priceLabel
      ? `за ${guests.priceLabel}`
      : trip.tourPackage
        ? 'за 1 человека'
        : '',
  };
}

export function buildTravelers(
  people: GuestSelection | null,
  level: ConstructorState['level'],
): TripPlanPageData['travelers'] {
  if (!people) return [];
  const travelers: TripPlanPageData['travelers'] = [];
  for (let i = 0; i < people.adults; i++) {
    travelers.push({
      id: `adult-${i}`,
      label: `Взрослый ${i + 1}`,
      description: level ? `Уровень группы: ${level}` : 'Уровень катания не выбран',
    });
  }
  for (let i = 0; i < people.children; i++) {
    const age = people.childAgeGroups[i];
    const ageLabel = age ? ` • ${age}` : '';
    travelers.push({
      id: `child-${i}`,
      label: `Ребёнок ${i + 1}${ageLabel}`,
      description: age ? 'Возрастная группа' : 'Возрастная группа не выбрана',
      isChild: true,
    });
  }
  return travelers;
}
