import {
  toTripPlanDate,
  type TripPlanAccommodationOffer,
  type TripPlanBookingDetails,
  type TripPlanFlightLeg,
} from '@/entities/trip-plan';
import { type ConstructorState, normalizeGuestSelection } from '@/widgets/travel-constructor';

import type { TripPlanPageData, TripPlanServiceData } from './types';

const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});
const pluralRules = new Intl.PluralRules('ru-RU');

function plural(value: number, one: string, few: string, many: string) {
  const form = pluralRules.select(value);
  return `${value} ${form === 'one' ? one : form === 'few' ? few : many}`;
}

function price(value: number) {
  return `${money.format(value)} ₽`;
}

function formatDate(date: Date | null) {
  return date && Number.isFinite(date.getTime()) ? dateFormatter.format(date) : 'Дата не выбрана';
}

function formatDateRange(from: Date | null, to: Date | null): string {
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

function calendarDate(value: string | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return toTripPlanDate(date) === value ? date : null;
}

function time(value: string | undefined): string | undefined {
  return value && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined;
}

function amount(value: number | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

function flightNote(leg: TripPlanFlightLeg | undefined, fallbackDate: Date | null): string {
  const departureTime = time(leg?.departureTime);
  const arrivalTime = time(leg?.arrivalTime);
  const stops = leg?.stops;
  return [
    formatDate(calendarDate(leg?.departureDate) ?? fallbackDate),
    [departureTime, arrivalTime].filter(Boolean).join(' → ') || null,
    stops === 0
      ? 'Прямой'
      : stops !== undefined && Number.isInteger(stops) && stops > 0
        ? plural(stops, 'пересадка', 'пересадки', 'пересадок')
        : null,
  ]
    .filter(Boolean)
    .join(' • ');
}

function accommodationBadge(
  accommodation: {
    name: string;
    accommodationType?: string;
    rating?: number;
    minRating?: number;
  },
  requestedMinRating?: number,
): string {
  const kindFromName = accommodation.name.match(
    /^(Отель|Гостиница|Санаторий|Апартаменты|Хостел|Гостевой дом|Квартира|Пентхаус)(?:\s|[«"“]|$)/i,
  )?.[1];
  const kind = accommodation.accommodationType || kindFromName || 'Проживание';
  const minRating = amount(requestedMinRating ?? accommodation.minRating);
  const rating = minRating ?? amount(accommodation.rating);
  return [
    kind,
    rating !== null && rating > 0
      ? `${money.format(rating)}${minRating !== null ? '+' : ''}`
      : null,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getTripNightCount(departure: Date | null, arrival: Date | null): number | null {
  if (!toTripPlanDate(departure) || !toTripPlanDate(arrival) || !departure || !arrival) return null;
  const nights =
    (Date.UTC(arrival.getFullYear(), arrival.getMonth(), arrival.getDate()) -
      Date.UTC(departure.getFullYear(), departure.getMonth(), departure.getDate())) /
    86_400_000;
  return nights > 0 ? nights : null;
}

export function calculateAccommodationTotal(
  offer: Pick<TripPlanAccommodationOffer, 'price' | 'priceBasis'>,
  guests: number | null,
  nights: number | null,
): number | null {
  if (!Number.isFinite(offer.price) || offer.price < 0) return null;
  switch (offer.priceBasis) {
    case 'person':
      return guests && guests > 0 ? offer.price * guests : null;
    case 'night':
      return nights && nights > 0 ? offer.price * nights : null;
    case 'trip':
      return offer.price;
    default:
      return null;
  }
}

export function buildTripPlan(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  bookings: TripPlanBookingDetails = {},
): TripPlanPageData {
  const { accommodation, transfer, departureDate, returnDate } = trip;
  const people = normalizeGuestSelection(trip.people);
  const guestCount = people ? people.adults + people.children : null;
  const guestLabel = people
    ? [
        ...(people.adults ? [plural(people.adults, 'взрослый', 'взрослых', 'взрослых')] : []),
        ...(people.children ? [plural(people.children, 'ребёнок', 'ребёнка', 'детей')] : []),
      ].join('; ')
    : 'Состав группы не выбран';
  const guestPriceLabel = people
    ? [
        ...(people.adults ? [plural(people.adults, 'взрослого', 'взрослых', 'взрослых')] : []),
        ...(people.children ? [plural(people.children, 'ребёнка', 'детей', 'детей')] : []),
      ].join(' и ')
    : '';
  const groupPriceNote = guestPriceLabel ? `За ${guestPriceLabel}` : undefined;
  const resort = trip.selectedResort;
  const destination = resort?.name ?? trip.toCity?.name ?? trip.toCountry?.name;
  const country = resort?.country ?? trip.toCountry?.name;
  const title = [destination, country !== destination ? country : null].filter(Boolean).join(', ');
  const origin = trip.fromCity?.name ?? trip.fromCountry?.name ?? 'Город отправления не выбран';
  const arrival =
    resort?.details.airport?.name ?? trip.toCity?.name ?? destination ?? 'Направление не выбрано';
  const nights = getTripNightCount(departureDate, returnDate);
  const nightLabel =
    nights === null ? 'Количество ночей не рассчитано' : plural(nights, 'ночь', 'ночи', 'ночей');
  const dateRange = formatDateRange(departureDate, returnDate);
  const activities = [...trip.activities, ...trip.liftTypes];
  const hotelName = selectedOffer?.name ?? accommodation?.name;
  const hotelDetails = selectedOffer ?? accommodation;
  const hotelPrice = selectedOffer
    ? calculateAccommodationTotal(selectedOffer, guestCount, nights)
    : accommodation
      ? calculateAccommodationTotal(
          { price: accommodation.pricePerNight, priceBasis: 'night' },
          guestCount,
          nights,
        )
      : null;
  const transferRate =
    transfer?.type === 'needed' || (!transfer && bookings.transfer)
      ? (amount(bookings.transfer?.pricePerPerson) ?? amount(transfer?.priceFrom))
      : null;
  const hasAirportTransfer =
    transfer?.type === 'needed' || (!transfer && Boolean(bookings.transfer));
  const transferTotal =
    transferRate !== null && guestCount !== null && guestCount > 0
      ? transferRate * guestCount
      : null;
  const ticketPrice = amount(bookings.tickets?.totalPrice);
  const knownPrices = [ticketPrice, hotelPrice, transferTotal].filter((value) => value !== null);
  const total = knownPrices.reduce((sum, amount) => sum + amount, 0);
  const totalLabel = knownPrices.length ? `от ${price(total)}` : 'Стоимость уточняется';
  const totalNote = guestPriceLabel ? `за ${guestPriceLabel}` : '';
  const perPersonHotelPrice =
    selectedOffer?.priceBasis === 'person'
      ? amount(selectedOffer.price)
      : hotelPrice !== null && guestCount && guestCount > 0
        ? hotelPrice / guestCount
        : null;
  const hotelPriceNote =
    perPersonHotelPrice !== null
      ? nights === null
        ? undefined
        : `За ${nightLabel}`
      : !hotelDetails
        ? 'Выберите вариант проживания'
        : selectedOffer?.priceBasis === 'unknown'
          ? 'Условия расчёта уточняет партнёр'
          : nights === null && (!selectedOffer || selectedOffer.priceBasis === 'night')
            ? 'Укажите даты проживания для расчёта'
            : !guestCount
              ? 'Укажите состав группы для расчёта'
              : 'Стоимость уточняется у партнёра';
  const perPersonTicketPrice =
    ticketPrice !== null && guestCount && guestCount > 0 ? ticketPrice / guestCount : null;
  const perPersonPrices = [perPersonTicketPrice, perPersonHotelPrice, transferRate].filter(
    (value) => value !== null,
  );
  const perPersonTotalLabel = perPersonPrices.length
    ? `от ${price(perPersonPrices.reduce((sum, value) => sum + value, 0))}`
    : 'Стоимость уточняется';
  const badges: TripPlanPageData['badges'] = [];
  if (people) badges.push({ icon: 'people', text: guestLabel });
  if (hotelDetails)
    badges.push({
      icon: 'hotel',
      text: accommodationBadge(hotelDetails, accommodation?.minRating),
    });
  if (transfer) badges.push({ icon: 'transfer', text: transfer.label });

  const flightNumbers = [
    bookings.tickets?.outbound?.flightNumber,
    bookings.tickets?.inbound?.flightNumber,
  ]
    .filter(Boolean)
    .join(' / ');

  const tickets: TripPlanServiceData = {
    fields: [
      {
        label: 'Маршрут туда',
        value: `${bookings.tickets?.outbound?.origin || origin} → ${bookings.tickets?.outbound?.destination || arrival}`,
        note: flightNote(bookings.tickets?.outbound, departureDate),
      },
      {
        label: 'Маршрут обратно',
        value: `${bookings.tickets?.inbound?.origin || arrival} → ${bookings.tickets?.inbound?.destination || origin}`,
        note: flightNote(bookings.tickets?.inbound, returnDate),
      },
      {
        label: 'Авиакомпания',
        value: bookings.tickets?.airline || '—',
        note: flightNumbers ? `Рейс: ${flightNumbers}` : undefined,
      },
      {
        label: 'Стоимость',
        value: ticketPrice === null ? 'Уточняется' : price(ticketPrice),
        note: groupPriceNote,
      },
    ],
    footer: `Билеты на ${bookings.tickets?.airline || '—'}`,
    bookingUrl: bookings.tickets?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'when',
  };
  const accommodationView: TripPlanServiceData = {
    fields: [
      {
        label: 'Название',
        value: hotelName ?? 'Проживание ещё не выбрано',
        note: selectedOffer?.location ?? (resort?.location || undefined),
      },
      {
        label: 'Даты',
        value: dateRange,
        note:
          [
            time(hotelDetails?.checkInTime) ? `Заезд ${time(hotelDetails?.checkInTime)}` : null,
            time(hotelDetails?.checkOutTime) ? `Выезд ${time(hotelDetails?.checkOutTime)}` : null,
          ]
            .filter(Boolean)
            .join(' • ') || undefined,
      },
      {
        label: 'Номер бронирования',
        value: hotelDetails?.bookingNumber || '—',
        note: hotelDetails?.bookingNumber
          ? 'Назовите номер администратору при заселении'
          : undefined,
      },
      {
        label: 'Стоимость',
        value: perPersonHotelPrice === null ? 'Уточняется' : `от ${price(perPersonHotelPrice)}`,
        note: hotelPriceNote,
      },
    ],
    amenities: selectedOffer?.amenities,
    footer: hotelDetails?.provider ?? '—',
    footerPhone: hotelDetails?.providerPhone,
    bookingUrl: hotelDetails?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'offers',
  };
  const transferView: TripPlanServiceData = {
    fields: [
      {
        label: 'Маршрут туда',
        value: hasAirportTransfer
          ? 'Аэропорт → Отель'
          : `${origin} → ${destination ?? 'Направление не выбрано'}`,
        note: [
          formatDate(
            calendarDate(bookings.tickets?.outbound?.arrivalDate) ??
              calendarDate(bookings.tickets?.outbound?.departureDate) ??
              departureDate,
          ),
          bookings.tickets?.outbound?.flightNumber
            ? `после прилёта рейса ${bookings.tickets.outbound.flightNumber}`
            : null,
        ]
          .filter(Boolean)
          .join(' • '),
      },
      {
        label: 'Маршрут обратно',
        value: hasAirportTransfer
          ? 'Отель → Аэропорт'
          : `${destination ?? 'Направление не выбрано'} → ${origin}`,
        note: [
          formatDate(calendarDate(bookings.tickets?.inbound?.departureDate) ?? returnDate),
          bookings.tickets?.inbound?.flightNumber
            ? `к вылету рейса ${bookings.tickets.inbound.flightNumber}`
            : null,
        ]
          .filter(Boolean)
          .join(' • '),
      },
      {
        label: 'Сервис',
        value:
          bookings.transfer?.provider ||
          (transfer?.type === 'self' || transfer?.type === 'own-car' ? transfer.label : '—'),
        note:
          transfer?.type === 'own-car' && transfer.parking
            ? `Парковка ${transfer.parking === 'needed' ? 'нужна' : 'не нужна'}`
            : bookings.transfer?.capacity && bookings.transfer.capacity > 0
              ? `До ${bookings.transfer.capacity} человек`
              : undefined,
      },
      {
        label: 'Стоимость',
        value: transferRate !== null ? `от ${price(transferRate)}` : 'Уточняется',
        note: transferRate !== null ? 'За человека' : undefined,
      },
    ],
    footer: bookings.transfer?.provider || '—',
    bookingUrl: bookings.transfer?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'transfer',
  };
  const travelers: TripPlanPageData['travelers'] = [];
  if (people) {
    for (let i = 0; i < people.adults; i++) {
      travelers.push({
        id: `adult-${i}`,
        label: `Взрослый ${i + 1}`,
        description: trip.level ? `Уровень группы: ${trip.level}` : 'Уровень катания не выбран',
      });
    }
    for (let i = 0; i < people.children; i++) {
      const age = people.childAgeGroups[i];
      travelers.push({
        id: `child-${i}`,
        label: `Ребёнок ${i + 1}${age ? ` • ${age}` : ''}`,
        description: age ? 'Возрастная группа' : 'Возрастная группа не выбрана',
        isChild: true,
      });
    }
  }
  const costs: TripPlanPageData['costs'] = [
    {
      id: 'tickets',
      label: bookings.tickets?.airline ? `Билеты (${bookings.tickets.airline})` : 'Билеты',
      amount: perPersonTicketPrice === null ? '—' : price(perPersonTicketPrice),
    },
    {
      id: 'accommodation',
      label: hotelName
        ? `Проживание (${[hotelName, nights === null ? null : nightLabel].filter(Boolean).join(' • ')})`
        : 'Проживание',
      amount: perPersonHotelPrice === null ? '—' : `от ${price(perPersonHotelPrice)}`,
    },
    {
      id: 'transfer',
      label: bookings.transfer?.provider ? `Трансфер (${bookings.transfer.provider})` : 'Трансфер',
      amount:
        transferRate === null
          ? transfer?.type === 'self' || transfer?.type === 'own-car'
            ? 'Самостоятельно'
            : '—'
          : `от ${price(transferRate)}`,
    },
  ];

  return {
    title: title || 'План поездки',
    subtitle: [dateRange, nights === null ? null : nightLabel, activities.join(', ') || null]
      .filter(Boolean)
      .join(' • '),
    badges,
    totalLabel,
    totalNote,
    perPersonTotalLabel,
    tickets,
    accommodation: accommodationView,
    transfer: transferView,
    travelers,
    additional: [
      ...((!people || people.adults === 0) && trip.level ? [`Уровень группы: ${trip.level}`] : []),
      ...trip.additional,
    ],
    costs,
  };
}
