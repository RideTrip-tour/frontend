import type { PartnerOffer } from '@/entities/partner-offer';

export interface PartnerOfferSearchFilters {
  maxPrice: number | null;
  minRating: number;
  accommodationType: 'any' | 'hotel' | 'apartment';
  transferRequired: boolean;
  maxDistanceToLift: number;
  minHotelStars: number;
  spaRequired: boolean;
  departureDate: string | null;
  returnDate: string | null;
}

export type RelaxableFilterKey = 'maxDistanceToLift' | 'minHotelStars' | 'spaRequired';

export interface FilterRelaxation {
  key: RelaxableFilterKey;
  label: string;
  description: string;
  originalValue: number | boolean;
  appliedValue: number | boolean;
}

export type PartnerOffersScenario =
  'auto' | 'exact' | 'similar' | 'error' | 'locations-error' | 'empty' | 'loading';

export type Scenario = PartnerOffersScenario;
export type PartnerOffersStatus = 'loading' | 'success' | 'empty' | 'error';
export type PartnerOffersMode = 'exact' | 'similar';
export type PartnerOffersErrorSource = 'offers' | 'locations';

export interface PartnerOffersSearchState {
  status: PartnerOffersStatus;
  mode: PartnerOffersMode;
  offers: PartnerOffer[];
  totalCount: number;
  relaxations: FilterRelaxation[];
  effectiveFilters: PartnerOfferSearchFilters;
  errorSource: PartnerOffersErrorSource | null;
}
