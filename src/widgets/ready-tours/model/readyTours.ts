import { rosaJanuaryTour } from '@/entities/tour';

import type { ReadyTourPreset } from './types';

const january = rosaJanuaryTour.itinerary;

export const READY_TOURS: ReadyTourPreset[] = [
  {
    id: 'sheregesh',
    name: 'Шерегеш, Россия',
    image: '/assets/images/imageBG.png',
    activity: 'сноуборд',
    activityOption: 'Фрирайд',
    destinationCity: { id: 101, name: 'Кузбас' },
    arrivalCity: 'Кузбас',
    transfer: 'нужен',
    transferType: 'needed',
    level: 'Средний',
    price: 7800,
  },
  {
    id: 'dombay',
    name: 'Домбай, Россия',
    image: '/assets/images/imageBG.png',
    activity: 'лыжи',
    activityOption: 'Трассовое катание',
    destinationCity: { id: 102, name: 'Домбай' },
    arrivalCity: 'Домбай',
    transfer: 'не нужен',
    transferType: 'self',
    level: 'Средний',
    price: 4600,
  },
  {
    id: 'elbrus',
    name: 'Приэльбрусье, Россия',
    image: '/assets/images/imageBG.png',
    activity: 'лыжи',
    activityOption: 'Трассовое катание',
    destinationCity: { id: 103, name: 'Нальчик' },
    arrivalCity: 'Нальчик',
    transfer: 'не нужен',
    transferType: 'self',
    level: 'Продвинутый',
    price: 4000,
  },
  {
    id: 'rosa-khutor',
    tourId: january.tourId,
    name: `${january.title}, Россия`,
    image: '/assets/images/imageBG.png',
    activity: 'лыжи',
    activityOption: january.activityOption,
    destinationCity: january.destinationCity,
    arrivalCity: january.destinationCity.name,
    transfer: 'включён',
    transferType: 'needed',
    level: january.level,
    price: january.basePricePerPerson,
  },
];
