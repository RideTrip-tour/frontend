import type {
  TripPlanBadge,
  TripPlanCostItem,
  TripPlanField,
  TripPlanTraveler,
} from '@/entities/trip-plan';
import type { ConstructorSelectionId } from '@/widgets/travel-constructor';

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
  badges: TripPlanBadge[];
  totalLabel: string;
  totalNote: string;
  perPersonTotalLabel: string;
  tickets: TripPlanServiceData;
  accommodation: TripPlanServiceData;
  transfer: TripPlanServiceData;
  travelers: TripPlanTraveler[];
  additional?: string[];
  costs: TripPlanCostItem[];
}
