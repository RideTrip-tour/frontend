export interface TripPlanAccommodationOffer {
  id: string;
  name: string;
  location: string;
  price: number;
  priceBasis: 'person' | 'night' | 'trip' | 'unknown';
  priceLabel: string;
  provider: string;
  amenities: string[];
  accommodationType?: string;
  minRating?: number;
  rating?: number;
  providerPhone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  bookingNumber?: string;
  bookingUrl?: string;
}

export interface TripPlanAccommodationSelection {
  offer: TripPlanAccommodationOffer;
  contextKey: string;
}
