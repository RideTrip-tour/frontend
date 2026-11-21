import { normalizeGuestSelection } from '../lib/guestSummary';
import type { ConstructorState } from './types';

export function hasConstructorSelections(state: ConstructorState): boolean {
  return Boolean(
    state.fromCity ||
    state.fromCountry ||
    state.toCity ||
    state.toCountry ||
    state.selectedResort ||
    state.departureDate ||
    state.returnDate ||
    state.activities.length > 0 ||
    state.liftTypes.length > 0 ||
    state.accommodation ||
    state.transfer ||
    normalizeGuestSelection(state.people) ||
    state.level ||
    state.additional.length > 0,
  );
}
