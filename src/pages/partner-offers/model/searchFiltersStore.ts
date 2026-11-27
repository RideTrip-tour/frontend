import { create } from 'zustand';

import { DEFAULT_PARTNER_OFFER_FILTERS } from '../mocks/scenarios';
import type { PartnerOfferSearchFilters, PartnerOffersScenario, RelaxableFilterKey } from './types';

interface SearchFiltersStore {
  filters: PartnerOfferSearchFilters;
  restoration: { scenario: PartnerOffersScenario; keys: RelaxableFilterKey[] };
  lastConstructorTransfer: boolean | null | undefined;
  constructorResetRevision: number;
  setFilters: (filters: PartnerOfferSearchFilters) => void;
  syncScenario: (scenario: PartnerOffersScenario) => void;
  restoreFilter: (scenario: PartnerOffersScenario, key: RelaxableFilterKey) => void;
  restoreAllFilters: (scenario: PartnerOffersScenario) => void;
  syncConstructorTransfer: (required: boolean | null) => void;
  syncConstructorReset: (revision: number) => void;
  resetFilters: () => void;
}

const createInitialState = (constructorResetRevision = 0) => ({
  filters: { ...DEFAULT_PARTNER_OFFER_FILTERS },
  restoration: { scenario: 'auto' as PartnerOffersScenario, keys: [] as RelaxableFilterKey[] },
  lastConstructorTransfer: undefined as boolean | null | undefined,
  constructorResetRevision,
});

export const usePartnerOfferSearchFilters = create<SearchFiltersStore>((set) => ({
  ...createInitialState(),
  setFilters: (filters) => set({ filters: { ...filters } }),
  syncScenario: (scenario) =>
    set((state) =>
      state.restoration.scenario === scenario ? state : { restoration: { scenario, keys: [] } },
    ),
  restoreFilter: (scenario, key) =>
    set((state) => ({
      restoration: {
        scenario,
        keys: Array.from(
          new Set([
            ...(state.restoration.scenario === scenario ? state.restoration.keys : []),
            key,
          ]),
        ),
      },
    })),
  restoreAllFilters: (scenario) =>
    set({
      restoration: { scenario, keys: ['maxDistanceToLift', 'minHotelStars', 'spaRequired'] },
    }),
  syncConstructorTransfer: (required) =>
    set((state) =>
      state.lastConstructorTransfer === required
        ? state
        : {
            lastConstructorTransfer: required,
            filters: { ...state.filters, transferRequired: required ?? false },
          },
    ),
  syncConstructorReset: (revision) =>
    set((state) =>
      state.constructorResetRevision === revision ? state : createInitialState(revision),
    ),
  resetFilters: () => set((state) => createInitialState(state.constructorResetRevision)),
}));
