import type { TripPlanAccommodationOffer, TripPlanBookingDetails } from '@/entities/trip-plan';
import type { ConstructorState } from '@/widgets/travel-constructor';
import { calculateConfiguredPackagePrice } from '@/widgets/travel-constructor/lib/pricing';

import { amount, price } from '../lib/tripPlanFormatters';
import type { TripPrices } from './types';

function calculateAccommodationTotal(
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

function getAccommodationTotal(
  accommodation: ConstructorState['accommodation'],
  selectedOffer: TripPlanAccommodationOffer | null,
  guestCount: number | null,
  nights: number | null,
): number | null {
  if (selectedOffer) return calculateAccommodationTotal(selectedOffer, guestCount, nights);
  if (accommodation?.pricePerNight == null) return null;
  return calculateAccommodationTotal(
    { price: accommodation.pricePerNight, priceBasis: 'night' },
    guestCount,
    nights,
  );
}

export function hasAirportTransfer(
  transfer: ConstructorState['transfer'],
  booking: TripPlanBookingDetails['transfer'],
): boolean {
  return transfer?.type === 'needed' || (!transfer && Boolean(booking));
}

function divideByGuestCount(value: number | null, guestCount: number | null): number | null {
  return value !== null && guestCount !== null && guestCount > 0 ? value / guestCount : null;
}

function totalPriceLabel(values: Array<number | null>): string {
  const knownPrices = values.filter((value) => value !== null);
  if (!knownPrices.length) return 'Стоимость уточняется';
  return `от ${price(knownPrices.reduce((sum, value) => sum + value, 0))}`;
}

export function calculateTripPrices(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  bookings: TripPlanBookingDetails,
  guestCount: number | null,
  nights: number | null,
): TripPrices {
  if (trip.tourPackage) {
    const perPerson = calculateConfiguredPackagePrice(trip.tourPackage, trip.additional);
    return {
      ticketPrice: null,
      perPersonTicketPrice: null,
      perPersonHotelPrice: null,
      transferRate: null,
      totalLabel: guestCount ? `от ${price(perPerson * guestCount)}` : `от ${price(perPerson)}`,
      perPersonTotalLabel: `от ${price(perPerson)}`,
    };
  }
  const hotelPrice = getAccommodationTotal(trip.accommodation, selectedOffer, guestCount, nights);
  const transferRate = hasAirportTransfer(trip.transfer, bookings.transfer)
    ? (amount(bookings.transfer?.pricePerPerson) ?? amount(trip.transfer?.priceFrom))
    : null;
  const transferTotal =
    transferRate !== null && guestCount !== null && guestCount > 0
      ? transferRate * guestCount
      : null;
  const ticketPrice = amount(bookings.tickets?.totalPrice);
  const perPersonHotelPrice =
    selectedOffer?.priceBasis === 'person'
      ? amount(selectedOffer.price)
      : divideByGuestCount(hotelPrice, guestCount);
  const perPersonTicketPrice = divideByGuestCount(ticketPrice, guestCount);
  return {
    ticketPrice,
    perPersonTicketPrice,
    perPersonHotelPrice,
    transferRate,
    totalLabel: totalPriceLabel([ticketPrice, hotelPrice, transferTotal]),
    perPersonTotalLabel: totalPriceLabel([perPersonTicketPrice, perPersonHotelPrice, transferRate]),
  };
}
