import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Accommodation } from '@/entities/accommodation/model/types';
import type { City } from '@/entities/city';
import type { Country } from '@/entities/country';
import type { Resort } from '@/entities/resort';
import type { TourPackageSelection } from '@/entities/tour/model/package';
import { useTripPlan } from '@/entities/trip-plan';

import { normalizeGuestSelection } from '../lib/guestSummary';
import { constructorDraftStorage, selectConstructorDraft } from './constructorDraftStorage';
import { hasConstructorSelections } from './constructorFlow';
import type {
  AdditionalOption,
  ConstructorSelectionId,
  ConstructorSessionState,
  GuestSelection,
  ReadyTourSelection,
  TransferSelection,
} from './types';

export const TOTAL_FIELDS = 8;

export interface ConstructorStore extends ConstructorSessionState {
  activeSelectorId: ConstructorSelectionId | null;
  resetRevision: number;

  proceedToPartnerOffers: () => boolean;
  proceedToTripPlan: () => boolean;

  setFromCity: (city: City | null) => void;
  setFromCountry: (country: Country | null) => void;
  setToCity: (city: City | null) => void;
  setToCountry: (country: Country | null) => void;
  setSelectedResort: (resort: Resort | null) => void;
  setDepartureDate: (date: Date | null) => void;
  setReturnDate: (date: Date | null) => void;
  setActivities: (activities: string[]) => void;
  setLiftTypes: (liftTypes: string[]) => void;
  setAccommodation: (accommodation: Accommodation | null) => void;
  setTransfer: (transfer: TransferSelection | null) => void;
  setPeople: (people: GuestSelection | null) => void;
  setLevel: (level: string | null) => void;
  setAdditional: (additional: AdditionalOption[]) => void;
  applyReadyTour: (selection: ReadyTourSelection) => void;
  applyTourPackage: (selection: TourPackageSelection) => void;
  discardTourPackage: () => void;
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

function createInitialState(): ConstructorSessionState & {
  activeSelectorId: ConstructorSelectionId | null;
} {
  return {
    tourPackage: null,
    flowStage: 'constructor',
    fromCity: null,
    fromCountry: null,
    toCity: null,
    toCountry: null,
    selectedResort: null,
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
    state.toCity || state.toCountry || state.selectedResort,
    state.departureDate && state.returnDate,
    state.activities.length > 0 || state.liftTypes.length > 0,
    state.accommodation,
    state.transfer,
    normalizeGuestSelection(state.people),
    state.level,
  ].filter(Boolean).length;
}

export function selectProgress(state: ConstructorStore) {
  return Math.round((selectFilledCount(state) / TOTAL_FIELDS) * 100);
}

function includedServicesChanged(previous: ConstructorSessionState, next: ConstructorSessionState) {
  return (
    previous.fromCity?.id !== next.fromCity?.id ||
    previous.fromCountry?.id !== next.fromCountry?.id ||
    previous.toCity?.id !== next.toCity?.id ||
    previous.toCountry?.id !== next.toCountry?.id ||
    previous.selectedResort?.id !== next.selectedResort?.id ||
    previous.accommodation?.id !== next.accommodation?.id ||
    previous.transfer?.type !== next.transfer?.type ||
    previous.transfer?.parking !== next.transfer?.parking ||
    previous.activities.join('|') !== next.activities.join('|') ||
    previous.liftTypes.join('|') !== next.liftTypes.join('|')
  );
}

const createConstructorStore: StateCreator<ConstructorStore> = (setState, get) => {
  const set = (
    update: Partial<ConstructorStore> | ((state: ConstructorStore) => Partial<ConstructorStore>),
  ) =>
    setState((state) => {
      const next = typeof update === 'function' ? update(state) : update;
      if (
        state.tourPackage &&
        !('tourPackage' in next) &&
        includedServicesChanged(state, { ...state, ...next })
      ) {
        return { ...next, tourPackage: null };
      }
      return next;
    });
  return {
    ...createInitialState(),
    resetRevision: 0,

    proceedToPartnerOffers: () => {
      if (!hasConstructorSelections(get())) return false;
      set({ flowStage: 'offers', activeSelectorId: null });
      return true;
    },
    proceedToTripPlan: () => {
      const state = get();
      if (!hasConstructorSelections(state) || state.flowStage === 'constructor') return false;
      set({ flowStage: 'plan', activeSelectorId: null });
      return true;
    },

    setFromCity: (fromCity) => set({ fromCity, flowStage: 'constructor' }),
    setFromCountry: (fromCountry) => set({ fromCountry, flowStage: 'constructor' }),
    setToCity: (toCity) => set({ toCity, selectedResort: null, flowStage: 'constructor' }),
    setToCountry: (toCountry) => set({ toCountry, selectedResort: null, flowStage: 'constructor' }),
    setSelectedResort: (selectedResort) => {
      if (selectedResort && !selectedResort.isOpen) {
        return;
      }

      set((state) => {
        if (!selectedResort) {
          return { selectedResort: null, flowStage: 'constructor' };
        }

        const matchesCity =
          state.toCity &&
          (selectedResort.cityId !== null
            ? state.toCity.id === selectedResort.cityId
            : state.toCity.name.trim().toLocaleLowerCase('ru-RU') ===
              selectedResort.cityName.trim().toLocaleLowerCase('ru-RU'));

        let toCity: City | null = null;
        if (matchesCity) {
          toCity = state.toCity;
        } else if (selectedResort.cityId !== null) {
          toCity = { id: selectedResort.cityId, name: selectedResort.cityName };
        }

        return {
          flowStage: 'constructor',
          selectedResort,
          toCity,
          toCountry: null,
        };
      });
    },
    setDepartureDate: (departureDate) => set({ departureDate, flowStage: 'constructor' }),
    setReturnDate: (returnDate) => set({ returnDate, flowStage: 'constructor' }),
    setActivities: (activities) => set({ activities, flowStage: 'constructor' }),
    setLiftTypes: (liftTypes) => set({ liftTypes, flowStage: 'constructor' }),
    setAccommodation: (accommodation) => set({ accommodation, flowStage: 'constructor' }),
    setTransfer: (transfer) => set({ transfer, flowStage: 'constructor' }),
    setPeople: (people) =>
      set({ people: normalizeGuestSelection(people), flowStage: 'constructor' }),
    setLevel: (level) => set({ level, flowStage: 'constructor' }),
    setAdditional: (additional) => set({ additional, flowStage: 'constructor' }),
    applyTourPackage: (selection) => {
      useTripPlan.getState().clearAccommodation();
      set((state) => ({
        ...createInitialState(),
        resetRevision: state.resetRevision + 1,
        fromCity: selection.fromCity ?? null,
        toCity: selection.destinationCity,
        selectedResort: selection.resort,
        departureDate: selection.departureDate,
        returnDate: selection.returnDate,
        people: normalizeGuestSelection(selection.people),
        level: selection.level,
        activities: selection.activityOption ? [selection.activityOption] : [],
        accommodation: selection.accommodation ?? null,
        transfer: selection.transfer ?? null,
        tourPackage: {
          tourId: selection.tourId,
          title: selection.title,
          basePricePerPerson: selection.basePricePerPerson,
          addons: selection.addons.filter((addon) => addon.quantity > 0),
        },
      }));
    },
    discardTourPackage: () => set({ tourPackage: null }),
    applyReadyTour: ({
      destinationCity,
      activityOption,
      transferType,
      transferLabel,
      transferPriceFrom,
      level,
    }) =>
      set({
        tourPackage: null,
        flowStage: 'constructor',
        toCity: destinationCity,
        toCountry: null,
        selectedResort: null,
        activities: [activityOption],
        liftTypes: [],
        transfer: {
          type: transferType,
          label: transferLabel,
          ...(transferPriceFrom === undefined ? {} : { priceFrom: transferPriceFrom }),
        },
        level,
        activeSelectorId: null,
      }),
    setActiveSelectorId: (activeSelectorId) => set({ activeSelectorId }),

    clearTickets: () =>
      set((state) => ({
        flowStage: 'constructor',
        fromCity: null,
        fromCountry: null,
        toCity: null,
        toCountry: null,
        selectedResort: null,
        departureDate: null,
        returnDate: null,
        activeSelectorId: isActiveSelector(state.activeSelectorId, ['from', 'to', 'when'])
          ? null
          : state.activeSelectorId,
      })),

    clearActivities: () =>
      set((state) => ({
        flowStage: 'constructor',
        activities: [],
        liftTypes: [],
        activeSelectorId: state.activeSelectorId === 'activity' ? null : state.activeSelectorId,
      })),

    clearAccommodation: () =>
      set((state) => ({
        flowStage: 'constructor',
        accommodation: null,
        activeSelectorId: state.activeSelectorId === 'hotel' ? null : state.activeSelectorId,
      })),

    clearTransfer: () =>
      set((state) => ({
        flowStage: 'constructor',
        transfer: null,
        activeSelectorId: state.activeSelectorId === 'transfer' ? null : state.activeSelectorId,
      })),

    clearPeople: () =>
      set((state) => ({
        flowStage: 'constructor',
        people: null,
        activeSelectorId: state.activeSelectorId === 'people' ? null : state.activeSelectorId,
      })),

    clearLevel: () =>
      set((state) => ({
        flowStage: 'constructor',
        level: null,
        activeSelectorId: state.activeSelectorId === 'level' ? null : state.activeSelectorId,
      })),

    clearAdditional: () =>
      set((state) => ({
        flowStage: 'constructor',
        additional: [],
        activeSelectorId: state.activeSelectorId === 'additional' ? null : state.activeSelectorId,
      })),

    resetConstructor: () => {
      useTripPlan.getState().clearAccommodation();
      set((state) => ({
        ...createInitialState(),
        resetRevision: state.resetRevision + 1,
      }));
    },
  };
};

export const useConstructor = create<ConstructorStore>()(
  persist<ConstructorStore, [], [], ConstructorSessionState>(createConstructorStore, {
    name: 'ride-trip-constructor-draft',
    version: 1,
    storage: constructorDraftStorage,
    partialize: (state) => ({ ...selectConstructorDraft(state), flowStage: state.flowStage }),
  }),
);
