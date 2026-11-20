export interface Accommodation {
  id: string;
  name: string;
  pricePerNight: number;
  accommodationType?: string;
  minRating?: number;
  rating?: number;
  provider?: string;
  providerPhone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  bookingNumber?: string;
  bookingUrl?: string;
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
