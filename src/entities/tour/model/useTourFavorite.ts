import { useSyncExternalStore } from 'react';

const changeEvent = 'tour-favorite-change';
const memoryFavorites = new Map<string, boolean>();

function subscribe(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(changeEvent, notify);
  };
}

function readFavorite(key: string) {
  const fallback = memoryFavorites.get(key);
  if (fallback !== undefined) return fallback;
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function useTourFavorite(tourId: string, userId?: number) {
  const key = `ride-trip.favorite-tour.${userId ?? 'guest'}.${tourId}`;
  const isFavorite = useSyncExternalStore(subscribe, () => readFavorite(key));
  const toggle = () => {
    const next = !readFavorite(key);
    try {
      if (next) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
      memoryFavorites.delete(key);
    } catch {
      memoryFavorites.set(key, next);
    }
    window.dispatchEvent(new Event(changeEvent));
  };
  return { isFavorite, toggle };
}
