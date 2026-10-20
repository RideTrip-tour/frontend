export interface Accommodation {
  id: string;
  name: string;
  pricePerNight: number;
}

export interface AccommodationOption extends Accommodation {
  location: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  locations: string[];
  amenities: string[];
  expandedFilters: string[];
  badges: string[];
}
