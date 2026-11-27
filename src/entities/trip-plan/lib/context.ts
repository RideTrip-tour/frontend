interface TripPlanContext {
  toCity: { id: number } | null;
  toCountry: { id: number } | null;
  selectedResort: { id: string } | null;
  departureDate: Date | null;
  returnDate: Date | null;
  accommodation: { id: string } | null;
  people: { adults: number; children: number; childAgeGroups: unknown[] } | null;
}

export function toTripPlanDate(date: Date | null): string | null {
  if (!date || !Number.isFinite(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getTripPlanContextKey(trip: TripPlanContext): string {
  return JSON.stringify([
    trip.toCity?.id ?? null,
    trip.toCountry?.id ?? null,
    trip.selectedResort?.id ?? null,
    toTripPlanDate(trip.departureDate),
    toTripPlanDate(trip.returnDate),
    trip.accommodation?.id ?? null,
    trip.people,
  ]);
}
