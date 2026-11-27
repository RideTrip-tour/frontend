export interface TripPlanFlightLeg {
  origin?: string;
  destination?: string;
  /** Calendar date at the departure airport, YYYY-MM-DD. */
  departureDate?: string;
  arrivalDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightNumber?: string;
  stops?: number;
}

export interface TripPlanTickets {
  outbound?: TripPlanFlightLeg;
  inbound?: TripPlanFlightLeg;
  airline?: string;
  /** Total ticket price for all travelers. */
  totalPrice?: number;
  bookingUrl?: string;
}

export interface TripPlanTransferDetails {
  provider?: string;
  pricePerPerson?: number;
  capacity?: number;
  bookingUrl?: string;
}

/** Optional booking data to be supplied by partner API adapters. */
export interface TripPlanBookingDetails {
  tickets?: TripPlanTickets;
  transfer?: TripPlanTransferDetails;
}
