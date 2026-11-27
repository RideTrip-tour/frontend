import type { PersistStorage } from 'zustand/middleware';

import type { TourAddon, TourPackageQuote } from '@/entities/tour/model/package';

import { OPTION_GROUPS } from '../config/additionalOptions';
import { normalizeGuestSelection } from '../lib/guestSummary';
import { hasConstructorSelections } from './constructorFlow';
import type { ConstructorSessionState, ConstructorState } from './types';

type ConstructorDraft = Omit<ConstructorState, 'departureDate' | 'returnDate'> & {
  departureDate: string | null;
  returnDate: string | null;
};

const additionalOptions = new Set(OPTION_GROUPS.flatMap((group) => group.options));
const childAgeGroups = new Set(['До 3-х лет', '4-12 лет', '13-17 лет']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(isString) : [];
}

function isTourAddon(value: unknown): value is TourAddon {
  return (
    isRecord(value) &&
    ['ski-pass', 'equipment', 'instructor'].includes(String(value.id)) &&
    isString(value.label) &&
    (value.unit === 'day' || value.unit === 'hour') &&
    isNumber(value.unitPrice) &&
    isNumber(value.quantity) &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  );
}

function restoreTourPackage(value: unknown): TourPackageQuote | null {
  if (
    !isRecord(value) ||
    !isString(value.tourId) ||
    !isString(value.title) ||
    !isNumber(value.basePricePerPerson) ||
    !Array.isArray(value.addons) ||
    !value.addons.every(isTourAddon) ||
    new Set(value.addons.map((addon) => addon.id)).size !== value.addons.length
  )
    return null;
  return {
    tourId: value.tourId,
    title: value.title,
    basePricePerPerson: value.basePricePerPerson,
    addons: value.addons,
  };
}

function namedLocation(value: unknown): ConstructorState['fromCity'] {
  return isRecord(value) && Number.isInteger(value.id) && isString(value.name)
    ? { id: value.id as number, name: value.name }
    : null;
}

function accommodation(value: unknown): ConstructorState['accommodation'] {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.name) ||
    !(value.pricePerNight === null || isNumber(value.pricePerNight))
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    pricePerNight: value.pricePerNight,
    ...(isString(value.accommodationType) ? { accommodationType: value.accommodationType } : {}),
    ...(isNumber(value.minRating) && value.minRating <= 5 ? { minRating: value.minRating } : {}),
    ...(isNumber(value.rating) && value.rating <= 5 ? { rating: value.rating } : {}),
    ...(isString(value.provider) ? { provider: value.provider } : {}),
    ...(isString(value.providerPhone) ? { providerPhone: value.providerPhone } : {}),
    ...(isString(value.checkInTime) ? { checkInTime: value.checkInTime } : {}),
    ...(isString(value.checkOutTime) ? { checkOutTime: value.checkOutTime } : {}),
    ...(isString(value.bookingNumber) ? { bookingNumber: value.bookingNumber } : {}),
    ...(isString(value.bookingUrl) ? { bookingUrl: value.bookingUrl } : {}),
  };
}

function transfer(value: unknown): ConstructorState['transfer'] {
  if (
    !isRecord(value) ||
    !['needed', 'self', 'own-car'].includes(String(value.type)) ||
    !isString(value.label)
  ) {
    return null;
  }

  return {
    type: value.type as NonNullable<ConstructorState['transfer']>['type'],
    label: value.label,
    ...(isNumber(value.priceFrom) ? { priceFrom: value.priceFrom } : {}),
    ...(value.parking === 'needed' || value.parking === 'not-needed'
      ? { parking: value.parking }
      : {}),
  };
}

function people(value: unknown): ConstructorState['people'] {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.adults) ||
    !Number.isInteger(value.children) ||
    !isNumber(value.adults) ||
    !isNumber(value.children) ||
    value.adults > 8 ||
    value.children > 8
  ) {
    return null;
  }

  const groups = Array.isArray(value.childAgeGroups) ? value.childAgeGroups : [];
  return normalizeGuestSelection({
    adults: value.adults,
    children: value.children,
    childAgeGroups: Array.from({ length: value.children }, (_, index) => {
      const group: unknown = groups[index];
      return typeof group === 'string' && childAgeGroups.has(group)
        ? (group as NonNullable<ConstructorState['people']>['childAgeGroups'][number])
        : null;
    }),
  });
}

function resort(value: unknown): ConstructorState['selectedResort'] {
  if (!isRecord(value) || !isRecord(value.details)) return null;
  const { details } = value;
  const { trailCounts, lifts } = details;
  if (
    !isRecord(trailCounts) ||
    !isRecord(lifts) ||
    !['id', 'name', 'cityName', 'country', 'location', 'image', 'imageAlt', 'description'].every(
      (key) => isString(value[key]),
    ) ||
    !(value.cityId === null || Number.isInteger(value.cityId)) ||
    ![
      'rating',
      'reviewsCount',
      'pricePerDay',
      'openTrails',
      'totalTrails',
      'minElevation',
      'maxElevation',
    ].every((key) => isNumber(value[key])) ||
    typeof value.isOpen !== 'boolean' ||
    !Array.isArray(value.difficulties) ||
    !value.difficulties.every((item) => ['green', 'blue', 'red', 'black'].includes(item)) ||
    !Array.isArray(value.amenities) ||
    !value.amenities.every(isString) ||
    !['green', 'blue', 'red', 'black'].every((key) => isNumber(trailCounts[key])) ||
    !['gondola', 'chair', 'surface'].every((key) => isNumber(lifts[key])) ||
    !['hasSnowpark', 'hasFreeride', 'hasParking'].every(
      (key) => typeof details[key] === 'boolean',
    ) ||
    !isNumber(details.rentalPricePerDay) ||
    !isNumber(details.instructorPricePerHour) ||
    !Array.isArray(details.suitableFor) ||
    !details.suitableFor.every(isString) ||
    !(
      details.airport === null ||
      (isRecord(details.airport) &&
        isString(details.airport.name) &&
        isNumber(details.airport.distanceKm))
    )
  ) {
    return null;
  }

  return value as unknown as ConstructorState['selectedResort'];
}

function formatCalendarDate(value: Date | null): string | null {
  if (!value || !Number.isFinite(value.getTime())) return null;
  return `${String(value.getFullYear()).padStart(4, '0')}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

function parseCalendarDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

export function selectConstructorDraft(state: ConstructorState): ConstructorState {
  return {
    tourPackage: state.tourPackage,
    fromCity: state.fromCity,
    fromCountry: state.fromCountry,
    toCity: state.toCity,
    toCountry: state.toCountry,
    selectedResort: state.selectedResort,
    departureDate: state.departureDate,
    returnDate: state.returnDate,
    activities: state.activities,
    liftTypes: state.liftTypes,
    accommodation: state.accommodation,
    transfer: state.transfer,
    people: normalizeGuestSelection(state.people),
    level: state.level,
    additional: state.additional,
  };
}

function serializeConstructorDraft(state: ConstructorState): ConstructorDraft {
  return {
    ...selectConstructorDraft(state),
    departureDate: formatCalendarDate(state.departureDate),
    returnDate: formatCalendarDate(state.returnDate),
  };
}

function restoreConstructorDraft(value: unknown): ConstructorState | null {
  if (!isRecord(value)) return null;
  return {
    tourPackage: restoreTourPackage(value.tourPackage),
    fromCity: namedLocation(value.fromCity),
    fromCountry: namedLocation(value.fromCountry),
    toCity: namedLocation(value.toCity),
    toCountry: namedLocation(value.toCountry),
    selectedResort: resort(value.selectedResort),
    departureDate: parseCalendarDate(value.departureDate),
    returnDate: parseCalendarDate(value.returnDate),
    activities: stringList(value.activities),
    liftTypes: stringList(value.liftTypes),
    accommodation: accommodation(value.accommodation),
    transfer: transfer(value.transfer),
    people: people(value.people),
    level: isString(value.level) ? value.level : null,
    additional: stringList(value.additional).filter(
      (option): option is ConstructorState['additional'][number] =>
        additionalOptions.has(option as ConstructorState['additional'][number]),
    ),
  };
}

export const constructorDraftStorage: PersistStorage<ConstructorSessionState> = {
  getItem: (name) => {
    try {
      const raw = window.sessionStorage.getItem(name);
      if (!raw) return null;
      const stored: unknown = JSON.parse(raw);
      if (!isRecord(stored) || stored.version !== 1) return null;
      const state = restoreConstructorDraft(stored.state);
      if (!state) return null;
      const savedStage = isRecord(stored.state) ? stored.state.flowStage : null;
      const flowStage =
        hasConstructorSelections(state) && (savedStage === 'offers' || savedStage === 'plan')
          ? savedStage
          : 'constructor';
      return { state: { ...state, flowStage }, version: 1 };
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.sessionStorage.setItem(
        name,
        JSON.stringify({
          state: { ...serializeConstructorDraft(value.state), flowStage: value.state.flowStage },
          version: 1,
        }),
      );
    } catch {
      // The constructor remains usable when browser storage is unavailable or full.
    }
  },
  removeItem: (name) => {
    try {
      window.sessionStorage.removeItem(name);
    } catch {
      // Storage can be blocked by browser settings.
    }
  },
};
