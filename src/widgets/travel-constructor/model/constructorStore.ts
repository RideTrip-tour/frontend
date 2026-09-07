import { create } from 'zustand';
import type {
  AdditionalOption,
  ConstructorSelectionId,
  ConstructorState,
  GuestSelection,
  SkiLevel,
  TransferSelection,
} from './types';
import type { Accommodation } from '@/entities/accommodation/model/types';
import type { City } from '@/entities/city';
import type { Country } from '@/entities/country';

export const TOTAL_FIELDS = 8;

export interface ConstructorStore extends ConstructorState {
  activeSelectorId: ConstructorSelectionId | null;

  setFromCity: (city: City | null) => void;
  setFromCountry: (country: Country | null) => void;
  setToCity: (city: City | null) => void;
  setToCountry: (country: Country | null) => void;
  setDepartureDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setActivities: (activities: string[]) => void;
  setLiftTypes: (liftTypes: string[]) => void;
  setAccommodation: (accommodation: Accommodation | null) => void;
  setTransfer: (transfer: TransferSelection | null) => void;
  setPeople: (people: GuestSelection | null) => void;
  setLevel: (level: SkiLevel | null) => void;
  setAdditional: (additional: AdditionalOption[]) => void;
  setActiveSelectorId: (selectorId: ConstructorSelectionId | null) => void;

  clearTickets: () => void;
  clearActivities: () => void;
  clearAccommodation: () => void;
  clearTransfer: () => void;
  clearPeople: () => void;
  clearLevel: () => void;
  clearAdditional: () => void;
  resetConstructor: () => void;
}

function createInitialState(): ConstructorState & {
  activeSelectorId: ConstructorSelectionId | null;
} {
  return {
    fromCity: null,
    fromCountry: null,
    toCity: null,
    toCountry: null,
    departureDate: null,
    returnDate: null,
    activities: [],
    liftTypes: [],
    accommodation: null,
    transfer: null,
    people: null,
    level: null,
    additional: [],
    activeSelectorId: null,
  };
}

function isActiveSelector(
  selectorId: ConstructorSelectionId | null,
  selectorIds: ConstructorSelectionId[],
) {
  return selectorId !== null && selectorIds.includes(selectorId);
}

export function selectFilledCount(state: ConstructorStore) {
  return [
    state.fromCity || state.fromCountry,
    state.toCity || state.toCountry,
    state.departureDate && state.returnDate,
    state.activities.length > 0 || state.liftTypes.length > 0,
    state.accommodation,
    state.transfer,
    state.people,
    state.level,
  ].filter(Boolean).length;
}

export function selectProgress(state: ConstructorStore) {
  return Math.round((selectFilledCount(state) / TOTAL_FIELDS) * 100);
}

export const useConstructor = create<ConstructorStore>((set) => ({
  ...createInitialState(),

  setFromCity: (fromCity) => set({ fromCity }),
  setFromCountry: (fromCountry) => set({ fromCountry }),
  setToCity: (toCity) => set({ toCity }),
  setToCountry: (toCountry) => set({ toCountry }),
  setDepartureDate: (departureDate) => set({ departureDate }),
  setReturnDate: (returnDate) => set({ returnDate }),
  setActivities: (activities) => set({ activities }),
  setLiftTypes: (liftTypes) => set({ liftTypes }),
  setAccommodation: (accommodation) => set({ accommodation }),
  setTransfer: (transfer) => set({ transfer }),
  setPeople: (people) => set({ people }),
  setLevel: (level) => set({ level }),
  setAdditional: (additional) => set({ additional }),
  setActiveSelectorId: (activeSelectorId) => set({ activeSelectorId }),

  clearTickets: () => set((state) => ({
    fromCity: null,
    fromCountry: null,
    toCity: null,
    toCountry: null,
    departureDate: null,
    returnDate: null,
    activeSelectorId: isActiveSelector(state.activeSelectorId, ['from', 'to', 'when'])
      ? null
      : state.activeSelectorId,
  })),

  clearActivities: () => set((state) => ({
    activities: [],
    liftTypes: [],
    activeSelectorId: state.activeSelectorId === 'activity'
      ? null
      : state.activeSelectorId,
  })),

  clearAccommodation: () => set((state) => ({
    accommodation: null,
    activeSelectorId: state.activeSelectorId === 'hotel'
      ? null
      : state.activeSelectorId,
  })),

  clearTransfer: () => set((state) => ({
    transfer: null,
    activeSelectorId: state.activeSelectorId === 'transfer'
      ? null
      : state.activeSelectorId,
  })),

  clearPeople: () => set((state) => ({
    people: null,
    activeSelectorId: state.activeSelectorId === 'people'
      ? null
      : state.activeSelectorId,
  })),

  clearLevel: () => set((state) => ({
    level: null,
    activeSelectorId: state.activeSelectorId === 'level'
      ? null
      : state.activeSelectorId,
  })),

  clearAdditional: () => set((state) => ({
    additional: [],
    activeSelectorId: state.activeSelectorId === 'additional'
      ? null
      : state.activeSelectorId,
  })),

  resetConstructor: () => set(createInitialState()),
}));
