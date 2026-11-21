import alpenClubImage from '@/assets/images/AlpenClub.png';
import berlogaImage from '@/assets/images/BeerLoga.png';
import levelTravelLogo from '@/assets/images/LevelTravel.png';
import ostrovokLogo from '@/assets/images/Ostrovok.png';
import snowPeakImage from '@/assets/images/SnowPeak.png';
import travelataLogo from '@/assets/images/Travelata.png';
import yandexTravelLogo from '@/assets/images/YandexTravel.png';

import type { PartnerOffer } from '../model/types';

/**
 * Фиктивные предложения партнёров для проверки экрана подбора.
 * Локальные фотографии из макета иллюстрируют карточки.
 * Данные и фотографии будут заменены ответом API партнёрских предложений.
 */
export const MOCK_PARTNER_OFFERS: readonly PartnerOffer[] = [
  {
    id: 'alpen-club',
    name: 'Отель Alpen Club',
    location: 'Шерегеш · Центр курорта',
    image: alpenClubImage,
    imageAlt: 'Заснеженный горнолыжный склон среди хвойного леса',
    rating: 4.8,
    reviews: 132,
    price: 45600,
    priceLabel: 'за человека',
    provider: 'LEVEL TRAVEL',
    providerLogo: levelTravelLogo,
    featured: true,
    badges: ['Завтрак включён', 'Wi-Fi', 'Трансфер', 'СПА'],
  },
  {
    id: 'berloga-hotel',
    name: 'Гостиница «Берлога»',
    location: 'Шерегеш · 200 м до подъёмника',
    image: berlogaImage,
    imageAlt: 'Лыжники на склоне среди заснеженных деревьев',
    rating: 4.6,
    reviews: 98,
    price: 39800,
    priceLabel: 'за человека',
    provider: 'Островок!',
    providerLogo: ostrovokLogo,
    badges: ['Завтрак включён', 'Бассейн', 'Трансфер', 'Wi-Fi'],
  },
  {
    id: 'snow-peak-apartments',
    name: 'Апартаменты “Snow Peak”',
    location: 'Шерегеш · В тихом районе',
    image: snowPeakImage,
    imageAlt: 'Горнолыжный склон с видом на горы и долину',
    rating: 4.7,
    reviews: 76,
    price: 36200,
    priceLabel: 'за человека',
    provider: 'Яндекс Путешествия',
    providerLogo: yandexTravelLogo,
    badges: ['Кухня', 'Wi-Fi', 'Парковка', 'Трансфер'],
  },
  {
    id: 'wood-hills-hotel',
    name: 'Отель “Wood Hills”',
    location: 'Шерегеш · В тихом районе',
    image: snowPeakImage,
    imageAlt: 'Горнолыжный склон с видом на горы и долину',
    rating: 4.5,
    reviews: 54,
    price: 41900,
    priceLabel: 'за человека',
    provider: 'travelata.ru',
    providerLogo: travelataLogo,
    badges: ['Завтрак включён', 'Wi-Fi', 'Баня', 'Трансфер'],
  },
  {
    id: 'taiga-lodge',
    name: 'Отель «Таёжный склон»',
    location: 'Шерегеш · 600 м до подъёмника',
    image: alpenClubImage,
    imageAlt: 'Заснеженный горнолыжный склон среди хвойного леса',
    rating: 4.7,
    reviews: 87,
    price: 42800,
    priceLabel: 'за человека',
    provider: 'LEVEL TRAVEL',
    providerLogo: levelTravelLogo,
    badges: ['Завтрак включён', 'Wi-Fi', 'Трансфер', 'СПА'],
  },
  {
    id: 'mountain-haven',
    name: 'Гостиница «Горный приют»',
    location: 'Шерегеш · 200 м до подъёмника',
    image: berlogaImage,
    imageAlt: 'Лыжники на склоне среди заснеженных деревьев',
    rating: 4.4,
    reviews: 63,
    price: 33500,
    priceLabel: 'за человека',
    provider: 'Островок!',
    providerLogo: ostrovokLogo,
    badges: ['Завтрак включён', 'Wi-Fi', 'Парковка', 'Трансфер'],
  },
  {
    id: 'panorama-apartments',
    name: 'Апартаменты «Панорама»',
    location: 'Шерегеш · 700 м до подъёмника',
    image: snowPeakImage,
    imageAlt: 'Горнолыжный склон с видом на горы и долину',
    rating: 4.5,
    reviews: 41,
    price: 29900,
    priceLabel: 'за человека',
    provider: 'Яндекс Путешествия',
    providerLogo: yandexTravelLogo,
    badges: ['Кухня', 'Wi-Fi', 'Парковка'],
  },
];
