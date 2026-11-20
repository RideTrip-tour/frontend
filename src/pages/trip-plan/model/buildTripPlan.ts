import type { TripPlanAccommodationOffer, TripPlanBookingDetails } from '@/entities/trip-plan';
import type { ConstructorState } from '@/widgets/travel-constructor';

import {
  buildGuestInfo,
  buildTravelers,
  buildTripDetails,
  buildTripHeader,
} from './tripPlanDetails';
import { calculateTripPrices } from './tripPlanPrices';
import {
  buildAccommodationSection,
  buildCostSummary,
  buildTicketsSection,
  buildTransferSection,
} from './tripPlanSections';
import type { TripPlanPageData } from './types';

export function buildTripPlan(
  trip: ConstructorState,
  selectedOffer: TripPlanAccommodationOffer | null,
  bookings: TripPlanBookingDetails = {},
): TripPlanPageData {
  const guests = buildGuestInfo(trip.people);
  const details = buildTripDetails(trip);
  const prices = calculateTripPrices(trip, selectedOffer, bookings, guests.count, details.nights);
  return {
    ...buildTripHeader(trip, selectedOffer, guests, details, prices),
    perPersonTotalLabel: prices.perPersonTotalLabel,
    tickets: buildTicketsSection(trip, bookings.tickets, guests, details, prices.ticketPrice),
    accommodation: buildAccommodationSection(
      trip,
      selectedOffer,
      guests,
      details,
      prices.perPersonHotelPrice,
    ),
    transfer: buildTransferSection(trip, bookings, details, prices.transferRate),
    travelers: buildTravelers(guests.people, trip.level),
    additional: [
      ...((!guests.people || guests.people.adults === 0) && trip.level
        ? [`Уровень группы: ${trip.level}`]
        : []),
      ...trip.additional,
    ],
    costs: buildCostSummary(trip, selectedOffer, bookings, details, prices),
  };
}
