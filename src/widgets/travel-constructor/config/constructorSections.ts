import type { ConstructorSelectionId } from '@/widgets/travel-constructor/model/types';

export const INITIAL_OPEN_ITEMS: Record<ConstructorSelectionId, boolean> = {
  from: false,
  to: false,
  when: false,
  activity: false,
  hotel: false,
  transfer: false,
  people: false,
  level: false,
  additional: false,
};
