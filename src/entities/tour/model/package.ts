import type { Accommodation } from '@/entities/accommodation/model/types';
import type { City } from '@/entities/city/model/types';
import type { Resort } from '@/entities/resort/model/types';

export type TourAddonId = 'ski-pass' | 'instructor' | 'equipment';

export interface TourAddon {
  id: TourAddonId;
  label: string;
  unit: 'day' | 'hour';
  unitPrice: number;
  quantity: number;
}

export interface TourPackageQuote {
  tourId: string;
  title: string;
  basePricePerPerson: number;
  addons: TourAddon[];
}

export type ChildAgeGroup = 'До 3-х лет' | '4-12 лет' | '13-17 лет';

export interface GuestSelection {
  adults: number;
  children: number;
  childAgeGroups: Array<ChildAgeGroup | null>;
}

export interface TourPackageSelection extends TourPackageQuote {
  resort: Resort | null;
  destinationCity: City;
  fromCity?: City | null;
  departureDate: Date;
  returnDate: Date;
  people: GuestSelection;
  activityOption: string;
  level: string;
  accommodation?: Accommodation | null;
  transfer?: { type: 'needed' | 'self' | 'own-car'; label: string } | null;
}

export function calculateTourAddonCost({ unitPrice, quantity }: TourAddon): number {
  return unitPrice * quantity;
}

export function calculateTourPackageTotal({
  basePricePerPerson,
  addons,
}: Pick<TourPackageQuote, 'basePricePerPerson' | 'addons'>): number {
  return addons.reduce((total, addon) => total + calculateTourAddonCost(addon), basePricePerPerson);
}

const quantityPlural = new Intl.PluralRules('ru-RU');
const unitForms = {
  day: { one: 'день', few: 'дня', many: 'дней' },
  hour: { one: 'час', few: 'часа', many: 'часов' },
};

export function formatTourAddonQuantity({ quantity, unit }: TourAddon): string {
  const form = quantityPlural.select(quantity);
  const words = unitForms[unit];
  return `${quantity} ${form === 'one' || form === 'few' ? words[form] : words.many}`;
}
