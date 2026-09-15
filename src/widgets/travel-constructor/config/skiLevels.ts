import type { SkiLevel } from '@/widgets/travel-constructor/model/types';

export const SKI_LEVELS: SkiLevel[] = [
  'Новичок',
  'Средний',
  'Продвинутый',
];

export interface SkiLevelHintLine {
  text: string;
  emphasis?: boolean;
}

export const SKI_LEVEL_HINTS: Record<
  SkiLevel,
  { bullets: SkiLevelHintLine[][]; heading: string }
> = {
  Новичок: {
    heading: 'Новичок',
    bullets: [
      [
        { text: 'Никогда', emphasis: true },
        { text: ' не катался / пробовал 1–2 раза' },
      ],
      [
        { text: 'Нужны ' },
        { text: 'простые', emphasis: true },
        { text: ' трассы и ' },
        { text: 'инструктор', emphasis: true },
      ],
    ],
  },
  Средний: {
    heading: 'Средний',
    bullets: [
      [
        { text: 'Катаюсь ' },
        { text: 'уверенно', emphasis: true },
      ],
      [
        { text: 'Хочу ' },
        { text: 'развивать технику', emphasis: true },
        { text: ' и пробовать новые маршруты' },
      ],
    ],
  },
  Продвинутый: {
    heading: 'Продвинутый',
    bullets: [
      [
        { text: 'Катаюсь ' },
        { text: 'регулярно', emphasis: true },
      ],
      [
        { text: 'Ищу ' },
        { text: 'сложные маршруты', emphasis: true },
        { text: ' и новые челленджи' },
      ],
    ],
  },
};
