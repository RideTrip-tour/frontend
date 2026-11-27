import type { Accommodation } from '@/entities/accommodation/model/types';
import type { City } from '@/entities/city/model/types';
import type { Country } from '@/entities/country/model/types';
import type { Resort } from '@/entities/resort';
import type { GuestSelection, TourPackageQuote } from '@/entities/tour/model/package';

export type TransferType = 'needed' | 'self' | 'own-car';
export type ParkingPreference = 'needed' | 'not-needed';
export type ConstructorFlowStage = 'constructor' | 'offers' | 'plan';
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

export type { GuestSelection, ChildAgeGroup } from '@/entities/tour/model/package';

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
  tourPackage: TourPackageQuote | null;
  fromCity: City | null;
  fromCountry: Country | null;
  toCity: City | null;
  toCountry: Country | null;
  selectedResort: Resort | null;
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

export interface ConstructorSessionState extends ConstructorState {
  flowStage: ConstructorFlowStage;
}
