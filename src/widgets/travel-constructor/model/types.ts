import type { Accommodation } from '@/entities/accommodation/model/types';
import type { City } from '@/entities/city/model/types';
import type { Country } from '@/entities/country/model/types';

export type TransferType = 'needed' | 'self' | 'own-car';
export type ParkingPreference = 'needed' | 'not-needed';
export type AdditionalOption =
  | 'Безбарьерная среда'
  | 'Пандусы и лифты'
  | 'Адаптированное проживание'
  | 'Низкая физическая нагрузка'
  | 'Спокойные трассы'
  | 'Близость инфраструктуры'
  | 'Сопровождение'
  | 'Помощь с подбором оборудования'
  | 'Индивидуальный инструктор';

export interface TransferSelection {
  type: TransferType;
  label: string;
  priceFrom?: number;
  parking?: ParkingPreference;
}

export type ChildAgeGroup = 'До 3-х лет' | '4-12 лет' | '13-17 лет';

export interface GuestSelection {
  adults: number;
  children: number;
  childAgeGroups: Array<ChildAgeGroup | null>;
}

export type ConstructorSelectionId =
  'from' | 'to' | 'when' | 'activity' | 'hotel' | 'transfer' | 'people' | 'level' | 'additional';

export interface ReadyTourSelection {
  destinationCity: City;
  activityOption: string;
  transferType: TransferType;
  transferLabel: string;
  transferPriceFrom?: number;
  level: string;
}

export interface ConstructorState {
  fromCity: City | null;
  fromCountry: Country | null;
  toCity: City | null;
  toCountry: Country | null;
  departureDate: Date | null;
  returnDate: Date | null;
  activities: string[];
  liftTypes: string[];
  accommodation: Accommodation | null;
  transfer: TransferSelection | null;
  people: GuestSelection | null;
  level: string | null;
  additional: AdditionalOption[];
}
