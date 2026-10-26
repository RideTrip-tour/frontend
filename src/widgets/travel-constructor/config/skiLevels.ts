export interface SkiLevelHintLine {
  text: string;
  emphasis?: boolean;
}

export const SKI_LEVEL_HINTS: Record<string, { bullets: SkiLevelHintLine[][]; heading: string }> =
  {
    Новичок: {
      heading: 'Новичок',
      bullets: [
        [{ text: 'Никогда', emphasis: true }, { text: ' не катался / пробовал 1–2 раза' }],
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
        [{ text: 'Катаюсь ' }, { text: 'уверенно', emphasis: true }],
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
        [{ text: 'Катаюсь ' }, { text: 'регулярно', emphasis: true }],
        [
          { text: 'Ищу ' },
          { text: 'сложные маршруты', emphasis: true },
          { text: ' и новые челленджи' },
        ],
      ],
    },
  };
