import { MOCK_PARTNER_OFFERS, type PartnerOffer } from '@/entities/partner-offer';

import type {
  FilterRelaxation,
  PartnerOfferSearchFilters,
  PartnerOffersErrorSource,
  PartnerOffersScenario,
  PartnerOffersSearchState,
  RelaxableFilterKey,
} from '../model/types';

interface OfferSearchProfile {
  distanceToLift: number;
  hotelStars: number;
  hasSpa: boolean;
  hasTransfer: boolean;
  accommodationType: 'hotel' | 'apartment';
  maxNights: number;
}

interface MockSearchOptions {
  scenario: PartnerOffersScenario;
  requestedFilters: PartnerOfferSearchFilters;
  restoredFilters?: readonly RelaxableFilterKey[];
  signal?: AbortSignal;
  delayMs?: number;
}

export const RELAXABLE_FILTER_KEYS: readonly RelaxableFilterKey[] = [
  'maxDistanceToLift',
  'minHotelStars',
  'spaRequired',
];

// Условия предложения постоянны для точного и похожего поиска.
// Ограничение по длительности позволяет проверить оба результата через даты конструктора.
const OFFER_PROFILES: Record<string, OfferSearchProfile> = {
  'alpen-club': {
    distanceToLift: 250,
    hotelStars: 4,
    hasSpa: true,
    hasTransfer: true,
    accommodationType: 'hotel',
    maxNights: 7,
  },
  'berloga-hotel': {
    distanceToLift: 200,
    hotelStars: 4,
    hasSpa: true,
    hasTransfer: true,
    accommodationType: 'hotel',
    maxNights: 7,
  },
  'snow-peak-apartments': {
    distanceToLift: 300,
    hotelStars: 4,
    hasSpa: true,
    hasTransfer: true,
    accommodationType: 'apartment',
    maxNights: 7,
  },
  'wood-hills-hotel': {
    distanceToLift: 300,
    hotelStars: 4,
    hasSpa: true,
    hasTransfer: true,
    accommodationType: 'hotel',
    maxNights: 7,
  },
  'taiga-lodge': {
    distanceToLift: 600,
    hotelStars: 4,
    hasSpa: true,
    hasTransfer: true,
    accommodationType: 'hotel',
    maxNights: 14,
  },
  'mountain-haven': {
    distanceToLift: 200,
    hotelStars: 3,
    hasSpa: false,
    hasTransfer: true,
    accommodationType: 'hotel',
    maxNights: 14,
  },
  'panorama-apartments': {
    distanceToLift: 700,
    hotelStars: 3,
    hasSpa: false,
    hasTransfer: false,
    accommodationType: 'apartment',
    maxNights: 14,
  },
};

const SIMILAR_SCENARIO_OFFER_IDS = new Set([
  'taiga-lodge',
  'mountain-haven',
  'panorama-apartments',
]);

const SIMILAR_RECOMMENDATIONS: Record<string, NonNullable<PartnerOffer['recommendation']>> = {
  'alpen-club': { label: 'Близко к вашим параметрам', tone: 'warning' },
  'berloga-hotel': { label: 'Хороший вариант', tone: 'info' },
  'snow-peak-apartments': { label: 'Суперцена', tone: 'success' },
  'taiga-lodge': { label: 'Близко к вашим параметрам', tone: 'warning' },
  'mountain-haven': { label: 'Хороший вариант', tone: 'info' },
  'panorama-apartments': { label: 'Суперцена', tone: 'success' },
};

export class PartnerOffersRequestError extends Error {
  readonly source: PartnerOffersErrorSource;

  constructor(source: PartnerOffersErrorSource) {
    super(
      source === 'locations' ? 'Locations service is unavailable' : 'Offers service is unavailable',
    );
    this.name = 'PartnerOffersRequestError';
    this.source = source;
  }
}

export function getFilterRelaxations(
  filters: PartnerOfferSearchFilters,
  restoredFilters: readonly RelaxableFilterKey[] = [],
): FilterRelaxation[] {
  const relaxations: FilterRelaxation[] = [];

  if (!restoredFilters.includes('maxDistanceToLift') && filters.maxDistanceToLift < 700) {
    relaxations.push({
      key: 'maxDistanceToLift',
      label: 'Расстояние до подъёмника',
      description: `до 700 м вместо ${filters.maxDistanceToLift} м`,
      originalValue: filters.maxDistanceToLift,
      appliedValue: 700,
    });
  }

  if (!restoredFilters.includes('minHotelStars') && filters.minHotelStars > 3) {
    relaxations.push({
      key: 'minHotelStars',
      label: 'Категория отеля',
      description: `3* вместо ${filters.minHotelStars}* и выше`,
      originalValue: filters.minHotelStars,
      appliedValue: 3,
    });
  }

  if (!restoredFilters.includes('spaRequired') && filters.spaRequired) {
    relaxations.push({
      key: 'spaRequired',
      label: 'СПА',
      description: 'не обязательно',
      originalValue: true,
      appliedValue: false,
    });
  }

  return relaxations;
}

export function applyFilterRelaxations(
  filters: PartnerOfferSearchFilters,
  relaxations: readonly FilterRelaxation[],
): PartnerOfferSearchFilters {
  const effectiveFilters = { ...filters };

  for (const relaxation of relaxations) {
    switch (relaxation.key) {
      case 'maxDistanceToLift':
        effectiveFilters.maxDistanceToLift = Number(relaxation.appliedValue);
        break;
      case 'minHotelStars':
        effectiveFilters.minHotelStars = Number(relaxation.appliedValue);
        break;
      case 'spaRequired':
        effectiveFilters.spaRequired = Boolean(relaxation.appliedValue);
        break;
    }
  }

  return effectiveFilters;
}

function matchesFilters(
  offer: PartnerOffer,
  profile: OfferSearchProfile,
  filters: PartnerOfferSearchFilters,
) {
  const nights =
    filters.departureDate && filters.returnDate
      ? (Date.parse(filters.returnDate) - Date.parse(filters.departureDate)) / (24 * 60 * 60 * 1000)
      : null;

  return (
    (nights === null || (nights >= 0 && nights <= profile.maxNights)) &&
    (filters.maxPrice === null || offer.price <= filters.maxPrice) &&
    offer.rating >= filters.minRating &&
    (filters.accommodationType === 'any' ||
      profile.accommodationType === filters.accommodationType) &&
    (!filters.transferRequired || profile.hasTransfer) &&
    profile.distanceToLift <= filters.maxDistanceToLift &&
    profile.hotelStars >= filters.minHotelStars &&
    (!filters.spaRequired || profile.hasSpa)
  );
}

export function searchMockPartnerOffers({
  scenario,
  requestedFilters,
  restoredFilters = [],
}: Pick<
  MockSearchOptions,
  'scenario' | 'requestedFilters' | 'restoredFilters'
>): PartnerOffersSearchState {
  const candidates =
    scenario === 'empty'
      ? []
      : MOCK_PARTNER_OFFERS.filter(
          (offer) => scenario !== 'similar' || SIMILAR_SCENARIO_OFFER_IDS.has(offer.id),
        );
  const exactOffers = candidates.filter((offer) => {
    const profile = OFFER_PROFILES[offer.id];
    return profile && matchesFilters(offer, profile, requestedFilters);
  });
  const relaxations =
    exactOffers.length === 0 ? getFilterRelaxations(requestedFilters, restoredFilters) : [];
  const effectiveFilters = applyFilterRelaxations(requestedFilters, relaxations);
  const similarOffers =
    exactOffers.length === 0 && relaxations.length > 0
      ? candidates.filter((offer) => {
          const profile = OFFER_PROFILES[offer.id];
          return profile && matchesFilters(offer, profile, effectiveFilters);
        })
      : [];
  const isSimilar = similarOffers.length > 0;
  const offers = (isSimilar ? similarOffers : exactOffers).map((offer) => ({
    ...offer,
    badges: [...offer.badges],
    ...(isSimilar
      ? {
          featured: false,
          recommendation: SIMILAR_RECOMMENDATIONS[offer.id],
        }
      : {}),
  }));

  return {
    status: offers.length > 0 ? 'success' : 'empty',
    mode: isSimilar ? 'similar' : 'exact',
    offers,
    totalCount: offers.length,
    relaxations: isSimilar ? relaxations : [],
    effectiveFilters: isSimilar ? effectiveFilters : { ...requestedFilters },
    errorSource: null,
  };
}

function waitForResponse(delayMs: number | null, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The request was aborted', 'AbortError'));
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onAbort = () => {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
      reject(new DOMException('The request was aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    if (delayMs !== null) {
      timeout = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      }, delayMs);
    }
  });
}

export async function requestMockPartnerOffers({
  scenario,
  requestedFilters,
  restoredFilters = [],
  signal,
  delayMs = 180,
}: MockSearchOptions): Promise<PartnerOffersSearchState> {
  // Снимок запроса не меняется, пока пользователь редактирует следующий поиск.
  const filtersSnapshot = { ...requestedFilters };
  const restoredSnapshot = [...restoredFilters];

  await waitForResponse(scenario === 'loading' ? null : delayMs, signal);
  signal?.throwIfAborted();

  if (scenario === 'error' || scenario === 'locations-error') {
    throw new PartnerOffersRequestError(scenario === 'locations-error' ? 'locations' : 'offers');
  }

  return searchMockPartnerOffers({
    scenario,
    requestedFilters: filtersSnapshot,
    restoredFilters: restoredSnapshot,
  });
}
