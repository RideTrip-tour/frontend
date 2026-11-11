export interface PartnerOffer {
  id: string;
  name: string;
  location: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviews: number;
  price: number;
  priceLabel: string;
  provider: string;
  providerLogo: string;
  badges: string[];
  featured?: boolean;
  recommendation?: {
    label: string;
    tone: 'warning' | 'info' | 'success';
  };
}
