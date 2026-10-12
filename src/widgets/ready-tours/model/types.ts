import type { City } from '@/entities/city';
import type { SkiLevel, TransferType } from '@/widgets/travel-constructor/model/types';

export type ReadyTourActivity = 'лыжи' | 'сноуборд';

export interface ReadyTourPreset {
  id: string;
  name: string;
  image: string;
  activity: ReadyTourActivity;
  /** Значение, которое выбирается в селекторе «Чем займемся?» */
  activityOption: string;
  destinationCity: City;
  arrivalCity: string;
  transfer: string;
  transferType: TransferType;
  level: SkiLevel;
  price: number;
}
