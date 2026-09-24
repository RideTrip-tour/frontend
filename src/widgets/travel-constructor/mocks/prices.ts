import type {
  AdditionalOption,
  SkiLevel,
} from '@/widgets/travel-constructor/model/types';

export const MOCK_TICKET_PRICE = 12_200;

export const MOCK_ACTIVITY_PRICES: Record<string, number> = {
  'Трассовое катание': 2_800,
  Фрирайд: 4_200,
  Фристайл: 3_500,
  'Гонки и экстрим': 5_000,
  'Ски-туры/Сплитбординг': 4_600,
  Сноупарк: 2_400,
  Бэккантри: 4_500,
  'Хели-ски': 12_000,
};

export const MOCK_LIFT_PRICES: Record<string, number> = {
  Ленточный: 600,
  Бугельный: 900,
  Кресельный: 1_200,
  'Канатная дорога / фуникулёр': 1_500,
  Гондольный: 1_800,
};

export const MOCK_SKI_LEVEL_PRICES: Record<SkiLevel, number> = {
  Новичок: 2_500,
  Средний: 1_800,
  Продвинутый: 1_200,
};

export const MOCK_ADDITIONAL_OPTION_PRICES: Record<AdditionalOption, number> = {
  'Безбарьерная среда': 0,
  'Пандусы и лифты': 0,
  'Адаптированное проживание': 1_500,
  'Низкая физическая нагрузка': 0,
  'Спокойные трассы': 0,
  'Близость инфраструктуры': 1_200,
  Сопровождение: 3_500,
  'Помощь с подбором оборудования': 800,
  'Индивидуальный инструктор': 4_500,
};
