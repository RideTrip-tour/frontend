import type { TransferType } from '@/widgets/travel-constructor/model/types';

export const TRANSFER_PRICE_FROM = 1800;

export interface TransferOption {
  type: TransferType;
  label: string;
}

export const TRANSFER_OPTIONS: TransferOption[] = [
  { type: 'needed', label: 'Нужен трансфер' },
  { type: 'self', label: 'Доберусь самостоятельно' },
  { type: 'own-car', label: 'На своём автомобиле' },
];
