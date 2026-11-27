import { calculateTourAddonCost, formatTourAddonQuantity } from '@/entities/tour/model/package';
import type {
  TripPlanAccommodationOffer,
  TripPlanBookingDetails,
  TripPlanFlightLeg,
} from '@/entities/trip-plan';
import type { ConstructorState } from '@/widgets/travel-constructor';
import { calculateAdditionalOptionsPrice } from '@/widgets/travel-constructor/lib/pricing';

import { calendarDate, formatDate, plural, price, time } from '../lib/tripPlanFormatters';
import { hasAirportTransfer } from './tripPlanPrices';
import type {
  TripGuestInfo,
  TripDetails,
  TripPrices,
  TripPlanPageData,
  TripPlanServiceData,
} from './types';

function flightStopsLabel(stops: number | undefined): string | null {
  if (stops === 0) return 'Прямой';
  if (stops !== undefined && Number.isInteger(stops) && stops > 0) {
    return plural(stops, 'пересадка', 'пересадки', 'пересадок');
  }
  return null;
}

function flightNote(leg: TripPlanFlightLeg | undefined, fallbackDate: Date | null): string {
  const departureTime = time(leg?.departureTime);
  const arrivalTime = time(leg?.arrivalTime);
  return [
    formatDate(calendarDate(leg?.departureDate) ?? fallbackDate),
    [departureTime, arrivalTime].filter(Boolean).join(' → ') || null,
    flightStopsLabel(leg?.stops),
  ]
    .filter(Boolean)
    .join(' • ');
}

function getAccommodationPriceNote(
  accommodation: ConstructorState['accommodation'],
  selectedOffer: TripPlanAccommodationOffer | null,
  details: TripDetails,
  perPersonHotelPrice: number | null,
  guestCount: number | null,
): string | undefined {
  if (perPersonHotelPrice !== null) {
    return details.nights === null ? undefined : `За ${details.nightLabel}`;
  }
  if (!selectedOffer && !accommodation) return 'Выберите вариант проживания';
  if (selectedOffer?.priceBasis === 'unknown') return 'Условия расчёта уточняет партнёр';
  if (details.nights === null && (!selectedOffer || selectedOffer.priceBasis === 'night')) {
    return 'Укажите даты проживания для расчёта';
  }
  if (!guestCount) return 'Укажите состав группы для расчёта';
  return 'Стоимость уточняется у партнёра';
}

export function buildTicketsSection(
  trip: ConstructorState,
  tickets: TripPlanBookingDetails['tickets'],
  guests: TripGuestInfo,
  details: TripDetails,
  ticketPrice: number | null,
): TripPlanServiceData {
  const flightNumbers = [tickets?.outbound?.flightNumber, tickets?.inbound?.flightNumber]
    .filter(Boolean)
    .join(' / ');

  return {
    fields: [
      {
        label: 'Маршрут туда',
        value: `${tickets?.outbound?.origin || details.origin} → ${tickets?.outbound?.destination || details.arrival}`,
        note: flightNote(tickets?.outbound, trip.departureDate),
      },
      {
        label: 'Маршрут обратно',
        value: `${tickets?.inbound?.origin || details.arrival} → ${tickets?.inbound?.destination || details.origin}`,
        note: flightNote(tickets?.inbound, trip.returnDate),
      },
      {
        label: 'Авиакомпания',
        value: tickets?.airline || '—',
        note: flightNumbers ? `Рейс: ${flightNumbers}` : undefined,
      },
      {
        label: 'Стоимость',
        value:
          trip.tourPackage && trip.fromCity
            ? 'Включено в тур'
            : ticketPrice === null
              ? 'Уточняется'
              : price(ticketPrice),
        note: !trip.tourPackage && guests.priceLabel ? `За ${guests.priceLabel}` : undefined,
      },
    ],
    footer: `Билеты на ${tickets?.airline || '—'}`,
    bookingUrl: tickets?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'when',
  };
}

function accommodationTimesNote(
  accommodation: NonNullable<ConstructorState['accommodation']> | TripPlanAccommodationOffer | null,
): string | undefined {
  const checkIn = time(accommodation?.checkInTime);
  const checkOut = time(accommodation?.checkOutTime);
  return (
    [checkIn ? `Заезд ${checkIn}` : null, checkOut ? `Выезд ${checkOut}` : null]
      .filter(Boolean)
      .join(' • ') || undefined
  );
}

export function buildAccommodationSection(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  guests: TripGuestInfo,
  details: TripDetails,
  perPersonHotelPrice: number | null,
): TripPlanServiceData {
  const hotelDetails = selectedOffer ?? trip.accommodation;
  return {
    fields: [
      {
        label: 'Название',
        value: hotelDetails?.name ?? 'Проживание ещё не выбрано',
        note: selectedOffer?.location ?? (trip.selectedResort?.location || undefined),
      },
      {
        label: 'Даты',
        value: details.dateRange,
        note: accommodationTimesNote(hotelDetails),
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
        value:
          trip.tourPackage && hotelDetails
            ? 'Включено в тур'
            : perPersonHotelPrice === null
              ? 'Уточняется'
              : `от ${price(perPersonHotelPrice)}`,
        note:
          trip.tourPackage && hotelDetails
            ? undefined
            : getAccommodationPriceNote(
                trip.accommodation,
                selectedOffer,
                details,
                perPersonHotelPrice,
                guests.count,
              ),
      },
    ],
    amenities: selectedOffer?.amenities,
    footer: hotelDetails?.provider ?? '—',
    footerPhone: hotelDetails?.providerPhone,
    bookingUrl: hotelDetails?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'offers',
  };
}

function transferServiceNote(
  transfer: ConstructorState['transfer'],
  booking: TripPlanBookingDetails['transfer'],
): string | undefined {
  if (transfer?.type === 'own-car' && transfer.parking) {
    const parkingLabel = transfer.parking === 'needed' ? 'нужна' : 'не нужна';
    return `Парковка ${parkingLabel}`;
  }
  if (booking?.capacity && booking.capacity > 0) return `До ${booking.capacity} человек`;
  return undefined;
}

export function buildTransferSection(
  trip: ConstructorState,
  bookings: TripPlanBookingDetails,
  details: TripDetails,
  transferRate: number | null,
): TripPlanServiceData {
  const airportTransfer = hasAirportTransfer(trip.transfer, bookings.transfer);
  return {
    fields: [
      {
        label: 'Маршрут туда',
        value: airportTransfer
          ? 'Аэропорт → Отель'
          : `${details.origin} → ${details.destination ?? 'Направление не выбрано'}`,
        note: [
          formatDate(
            calendarDate(bookings.tickets?.outbound?.arrivalDate) ??
              calendarDate(bookings.tickets?.outbound?.departureDate) ??
              trip.departureDate,
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
        value: airportTransfer
          ? 'Отель → Аэропорт'
          : `${details.destination ?? 'Направление не выбрано'} → ${details.origin}`,
        note: [
          formatDate(calendarDate(bookings.tickets?.inbound?.departureDate) ?? trip.returnDate),
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
          (trip.transfer?.type === 'self' || trip.transfer?.type === 'own-car'
            ? trip.transfer.label
            : '—'),
        note: transferServiceNote(trip.transfer, bookings.transfer),
      },
      {
        label: 'Стоимость',
        value:
          trip.tourPackage && airportTransfer
            ? 'Включено в тур'
            : transferRate !== null
              ? `от ${price(transferRate)}`
              : 'Уточняется',
        note: transferRate !== null ? 'За человека' : undefined,
      },
    ],
    footer: bookings.transfer?.provider || '—',
    bookingUrl: bookings.transfer?.bookingUrl,
    actionLabel: 'Открыть бронирование',
    selectorId: 'transfer',
  };
}

function transferCostLabel(transfer: ConstructorState['transfer'], rate: number | null): string {
  if (rate !== null) return `от ${price(rate)}`;
  if (transfer?.type === 'self' || transfer?.type === 'own-car') return 'Самостоятельно';
  return '—';
}

export function buildCostSummary(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  bookings: TripPlanBookingDetails,
  details: TripDetails,
  prices: TripPrices,
): TripPlanPageData['costs'] {
  if (trip.tourPackage) {
    const quote = trip.tourPackage;
    return [
      { id: 'package', label: `Тур «${quote.title}»`, amount: price(quote.basePricePerPerson) },
      ...quote.addons.map((addon) => ({
        id: addon.id,
        label: `${addon.label} · ${formatTourAddonQuantity(addon)}`,
        amount: price(calculateTourAddonCost(addon)),
      })),
      ...trip.additional.map((option) => ({
        id: option,
        label: option,
        amount: price(calculateAdditionalOptionsPrice([option])),
      })),
    ];
  }
  const hotelName = selectedOffer?.name ?? trip.accommodation?.name;
  const hotelLabel = [hotelName, details.nights === null ? null : details.nightLabel]
    .filter(Boolean)
    .join(' • ');
  return [
    {
      id: 'tickets',
      label: bookings.tickets?.airline ? `Билеты (${bookings.tickets.airline})` : 'Билеты',
      amount: prices.perPersonTicketPrice === null ? '—' : price(prices.perPersonTicketPrice),
    },
    {
      id: 'accommodation',
      label: hotelName ? `Проживание (${hotelLabel})` : 'Проживание',
      amount: prices.perPersonHotelPrice === null ? '—' : `от ${price(prices.perPersonHotelPrice)}`,
    },
    {
      id: 'transfer',
      label: bookings.transfer?.provider ? `Трансфер (${bookings.transfer.provider})` : 'Трансфер',
      amount: transferCostLabel(trip.transfer, prices.transferRate),
    },
  ];
}
