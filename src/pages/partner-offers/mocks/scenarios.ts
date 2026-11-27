import type { PartnerOfferSearchFilters, PartnerOffersScenario } from '../model/types';

export const DEFAULT_PARTNER_OFFER_FILTERS: Readonly<PartnerOfferSearchFilters> = {
  maxPrice: null,
  minRating: 0,
  accommodationType: 'any',
  transferRequired: false,
  maxDistanceToLift: 300,
  minHotelStars: 4,
  spaRequired: true,
  departureDate: null,
  returnDate: null,
};

const SCENARIOS: readonly PartnerOffersScenario[] = [
  'auto',
  'exact',
  'similar',
  'error',
  'locations-error',
  'empty',
  'loading',
];

export function getPartnerOffersScenario(search: URLSearchParams | string): PartnerOffersScenario {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const scenario = params.get('scenario');

  return SCENARIOS.find((value) => value === scenario) ?? 'auto';
}
