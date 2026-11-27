import type { TripBadge, TripCostItem } from '@/entities/trip';
import type { TripPlanField, TripPlanTraveler } from '@/entities/trip-plan';
import type { ConstructorSelectionId, GuestSelection } from '@/widgets/travel-constructor';

export type TripPlanEditTarget = ConstructorSelectionId | 'offers';

export interface TripPlanServiceData {
  fields: TripPlanField[];
  footer: string;
  footerPhone?: string;
  actionLabel: string;
  selectorId: TripPlanEditTarget;
  amenities?: string[];
  bookingUrl?: string;
}

export interface TripPlanPageData {
  title: string;
  subtitle: string;
  badges: TripBadge[];
  totalLabel: string;
  totalNote: string;
  perPersonTotalLabel: string;
  tickets: TripPlanServiceData;
  accommodation: TripPlanServiceData;
  transfer: TripPlanServiceData;
  travelers: TripPlanTraveler[];
  additional?: string[];
  costs: TripCostItem[];
}

export interface TripGuestInfo {
  people: GuestSelection | null;
  count: number | null;
  label: string;
  priceLabel: string;
}

export interface TripDetails {
  title: string;
  destination: string | undefined;
  origin: string;
  arrival: string;
  nights: number | null;
  nightLabel: string;
  dateRange: string;
}

export interface TripPrices {
  ticketPrice: number | null;
  perPersonTicketPrice: number | null;
  perPersonHotelPrice: number | null;
  transferRate: number | null;
  totalLabel: string;
  perPersonTotalLabel: string;
}
