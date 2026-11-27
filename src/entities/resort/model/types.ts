export type TrailDifficulty = 'green' | 'blue' | 'red' | 'black';

export interface ResortDetails {
  trailCounts: Record<TrailDifficulty, number>;
  lifts: {
    gondola: number;
    chair: number;
    surface: number;
  };
  hasSnowpark: boolean;
  hasFreeride: boolean;
  trailLengthKm?: number;
  hasNightSkiing?: boolean;
  rentalLocations?: number;
  hasInstructors?: boolean;
  hasRescueService?: boolean;
  hasLockers?: boolean;
  accessibility?: readonly string[];
  directions?: string;
  rentalPricePerDay: number;
  instructorPricePerHour: number;
  suitableFor: readonly string[];
  hasParking: boolean;
  airport: {
    name: string;
    distanceKm: number;
  } | null;
}

export interface Resort {
  id: string;
  name: string;
  cityId: number | null;
  cityName: string;
  country: string;
  location: string;
  image: string;
  imageAlt: string;
  description: string;
  details: ResortDetails;
  rating: number;
  reviewsCount: number;
  pricePerDay: number;
  isOpen: boolean;
  openTrails: number;
  totalTrails: number;
  minElevation: number;
  maxElevation: number;
  difficulties: readonly TrailDifficulty[];
  amenities: readonly string[];
}
