import { useState } from 'react';

import type { TourAddon, TourAddonId, TourDetails } from '@/entities/tour';

type Quantities = Partial<Record<TourAddonId, number>>;

function restore(key: string, offers: TourDetails['offers']): Quantities {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(key) ?? '{}');
    if (!saved || typeof saved !== 'object') return {};
    const quantities: Quantities = {};
    for (const { id } of offers) {
      const value: unknown = Reflect.get(saved, id);
      if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
        quantities[id] = value;
      }
    }
    return quantities;
  } catch {
    return {};
  }
}

export function useTourAddons(tour: TourDetails) {
  const key = `ride-trip.tour-addons.${tour.itinerary.tourId}`;
  const [quantities, setQuantities] = useState(() => restore(key, tour.offers));
  const selected: TourAddon[] = tour.offers.flatMap((offer) => {
    const quantity = quantities[offer.id] ?? 0;
    return quantity > 0 ? [{ ...offer, quantity }] : [];
  });

  const setQuantity = (id: TourAddonId, quantity: number) => {
    const next = { ...quantities, [id]: quantity };
    setQuantities(next);
    try {
      sessionStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Selection still works when browser storage is unavailable.
    }
  };
  return { selected, quantities, setQuantity };
}
