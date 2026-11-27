import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import type { TripPlanAccommodationOffer, TripPlanAccommodationSelection } from './types';

interface AccommodationState {
  accommodation: TripPlanAccommodationSelection | null;
}

interface TripPlanStore extends AccommodationState {
  selectAccommodation: (offer: TripPlanAccommodationOffer, contextKey: string) => void;
  clearAccommodation: () => void;
}

const optionalStringFields = [
  'accommodationType',
  'providerPhone',
  'checkInTime',
  'checkOutTime',
  'bookingNumber',
  'bookingUrl',
] as const;

function isScore(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5;
}

function isTripPlanAccommodation(value: unknown): value is TripPlanAccommodationSelection {
  if (!value || typeof value !== 'object' || !('offer' in value) || !('contextKey' in value)) {
    return false;
  }
  const { offer, contextKey } = value;
  if (!offer || typeof offer !== 'object') return false;
  const data = offer as Record<string, unknown>;
  return (
    typeof contextKey === 'string' &&
    ['id', 'name', 'location', 'priceLabel', 'provider'].every(
      (key) => typeof data[key] === 'string',
    ) &&
    typeof data.price === 'number' &&
    Number.isFinite(data.price) &&
    data.price >= 0 &&
    ['person', 'night', 'trip', 'unknown'].includes(String(data.priceBasis)) &&
    Array.isArray(data.amenities) &&
    data.amenities.every((item) => typeof item === 'string') &&
    optionalStringFields.every((key) => data[key] === undefined || typeof data[key] === 'string') &&
    (data.minRating === undefined || isScore(data.minRating)) &&
    (data.rating === undefined || isScore(data.rating))
  );
}

function restoreAccommodation(value: unknown): TripPlanAccommodationSelection | null {
  if (!value || typeof value !== 'object' || !('offer' in value) || !('contextKey' in value)) {
    return null;
  }
  if (!value.offer || typeof value.offer !== 'object') return null;
  const data = value.offer as Record<string, unknown>;
  const metadata = Object.fromEntries(
    optionalStringFields
      .filter((key) => typeof data[key] === 'string')
      .map((key) => [key, data[key]]),
  );
  const selection = {
    contextKey: value.contextKey,
    offer: {
      id: data.id,
      name: data.name,
      location: data.location,
      price: data.price,
      priceBasis: data.priceBasis,
      priceLabel: data.priceLabel,
      provider: data.provider,
      amenities: data.amenities,
      ...metadata,
      ...(isScore(data.minRating) ? { minRating: data.minRating } : {}),
      ...(isScore(data.rating) ? { rating: data.rating } : {}),
    },
  };
  return isTripPlanAccommodation(selection) ? selection : null;
}

const storage: PersistStorage<AccommodationState> = {
  getItem: (name) => {
    try {
      const raw = window.sessionStorage.getItem(name);
      if (!raw) return null;
      const value: unknown = JSON.parse(raw);
      if (
        !value ||
        typeof value !== 'object' ||
        !('state' in value) ||
        !('version' in value) ||
        value.version !== 1
      )
        return null;
      const state = value.state;
      if (!state || typeof state !== 'object' || !('accommodation' in state)) return null;
      const selection = restoreAccommodation(state.accommodation);
      return { state: { accommodation: selection }, version: 1 };
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.sessionStorage.setItem(name, JSON.stringify(value));
    } catch {
      // The current selection still works when browser storage is unavailable.
    }
  },
  removeItem: (name) => {
    try {
      window.sessionStorage.removeItem(name);
    } catch {
      // Storage may be disabled by the browser.
    }
  },
};

export const useTripPlan = create<TripPlanStore>()(
  persist(
    (set) => ({
      accommodation: null,
      selectAccommodation: (offer, contextKey) =>
        set({ accommodation: restoreAccommodation({ offer, contextKey }) }),
      clearAccommodation: () => set({ accommodation: null }),
    }),
    {
      name: 'ride-trip-plan-accommodation',
      version: 1,
      storage,
      partialize: ({ accommodation }) => ({ accommodation }),
    },
  ),
);
