import { MOCK_RESORTS } from '@/entities/resort';

import type { TourAddon, TourPackageSelection } from './package';
import { ROSA_KHUTOR_REVIEWS, type TourReview } from './reviews';

interface IncludedService {
  id: string;
  icon: 'flight' | 'hotel' | 'pass' | 'transfer' | 'rental';
  text: string;
}

export interface TourOverview {
  description: readonly string[];
  level: 0 | 1 | 2 | 3;
  levelLabel: string;
  duration: string;
  datesLabel: string;
  groupLabel: string;
  ageLabel?: string;
  included: readonly IncludedService[];
  audience: readonly string[];
}

type Itinerary = Omit<TourPackageSelection, 'resort' | 'addons'>;
export type TourAddonOffer = Omit<TourAddon, 'quantity'>;

export interface TourDetails {
  itinerary: Itinerary;
  location: string;
  resortId?: string;
  overview: TourOverview;
  offers: readonly TourAddonOffer[];
  reviews: readonly TourReview[];
}

// Partner quotes and the saved itinerary are local examples until the tours API is available.
export const rosaJanuaryTour: TourDetails = {
  itinerary: {
    tourId: 'rosa-khutor-january',
    title: 'Роза Хутор',
    basePricePerPerson: 56300,
    fromCity: { id: 4, name: 'Екатеринбург' },
    destinationCity: { id: 104, name: 'Сочи' },
    departureDate: new Date(2027, 0, 5),
    returnDate: new Date(2027, 0, 12),
    people: { adults: 2, children: 0, childAgeGroups: [] },
    activityOption: 'Трассовое катание',
    level: 'Новичок',
    accommodation: { id: 'rosa-alpen-club', name: 'Отель Alpen Club', pricePerNight: null },
    transfer: { type: 'needed', label: 'Трансфер аэропорт ↔ отель' },
  },
  resortId: 'rosa-khutor',
  location: 'Сочи, Краснодарский край, Россия',
  overview: {
    description: [
      '«Роза Хутор» принимала соревнования зимних Олимпийских игр 2014 года. Курорт расположен на северо-восточном склоне горы Аибга и предлагает не только горнолыжные трассы, но и инфраструктуру для отдыха после катания.',
      'Здесь есть учебные склоны для тех, кто только осваивает лыжи или сноуборд, сноуборд-парк и зоны для фристайла. Часть трасс освещается для вечернего катания. Внизу курорта расположены отели, кафе и прогулочные улицы.',
    ],
    level: 1,
    levelLabel: 'Новичок',
    duration: '7 дней',
    datesLabel: '5–12 января',
    groupLabel: '2 взрослых',
    ageLabel: '18+',
    included: [
      { id: 'flight', icon: 'flight', text: 'Перелёт Екатеринбург → Сочи · туда и обратно' },
      { id: 'hotel', icon: 'hotel', text: 'Проживание в отеле «Alpen Club» · 7 ночей с завтраком' },
      { id: 'pass', icon: 'pass', text: 'Ски-пасс на 6 дней катания' },
      { id: 'transfer', icon: 'transfer', text: 'Трансфер аэропорт ↔ отель' },
      { id: 'rental', icon: 'rental', text: 'Прокат базового комплекта снаряжения на весь срок' },
    ],
    audience: [
      'Тем, кто едет на Кавказ впервые и хочет понятный курорт с инфраструктурой.',
      'Семьям — для них есть учебные склоны и аквапарк.',
      'Тем, кто ценит красивые виды и прогулки по набережной.',
      'Опытным райдерам понравятся сноуборд-парк, фристайл-центр и вечернее катание.',
      'Тем, кто хочет совместить катание с городским комфортом.',
    ],
  },
  offers: [
    { id: 'ski-pass', label: 'Дополнительный день ски-пасса', unit: 'day', unitPrice: 2500 },
    { id: 'equipment', label: 'Прокат дополнительного снаряжения', unit: 'day', unitPrice: 1200 },
    { id: 'instructor', label: 'Инструктор', unit: 'hour', unitPrice: 2500 },
  ],
  reviews: ROSA_KHUTOR_REVIEWS,
};

const savedWeekend: TourDetails = {
  itinerary: {
    tourId: 'my-sochi-weekend',
    title: 'Мои выходные в Сочи',
    basePricePerPerson: 18700,
    fromCity: { id: 1, name: 'Москва' },
    destinationCity: { id: 104, name: 'Сочи' },
    departureDate: new Date(2027, 1, 19),
    returnDate: new Date(2027, 1, 21),
    people: { adults: 1, children: 0, childAgeGroups: [] },
    activityOption: 'Трассовое катание',
    level: 'Средний',
    transfer: { type: 'self', label: 'Доберусь самостоятельно' },
  },
  location: 'Сочи, Краснодарский край, Россия',
  overview: {
    description: ['Самостоятельная поездка в Сочи на выходные. В план включён перелёт из Москвы.'],
    level: 2,
    levelLabel: 'Средний',
    duration: '2 ночи',
    datesLabel: '19–21 февраля',
    groupLabel: '1 взрослый',
    included: [{ id: 'flight', icon: 'flight', text: 'Перелёт Москва → Сочи · туда и обратно' }],
    audience: [],
  },
  offers: [],
  reviews: [],
};

const tours = [rosaJanuaryTour, savedWeekend];

export const findTour = (id?: string) => tours.find(({ itinerary }) => itinerary.tourId === id);
export const findTourResort = (tour: TourDetails) =>
  MOCK_RESORTS.find((resort) => resort.id === tour.resortId) ?? null;
export const tourPath = (id: string) => `/tour/${encodeURIComponent(id)}`;

export function toConstructorPackage(tour: TourDetails, addons: TourAddon[]): TourPackageSelection {
  return { ...tour.itinerary, resort: findTourResort(tour), addons };
}
