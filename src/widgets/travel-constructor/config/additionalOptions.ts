import type { AdditionalOption } from '@/widgets/travel-constructor/model/types';

export interface AdditionalOptionsGroup {
  title: string;
  options: AdditionalOption[];
}

export const OPTION_GROUPS: AdditionalOptionsGroup[] = [
  {
    title: 'Доступность',
    options: [
      'Безбарьерная среда',
      'Пандусы и лифты',
      'Адаптированное проживание',
    ],
  },
  {
    title: 'Комфорт',
    options: [
      'Низкая физическая нагрузка',
      'Спокойные трассы',
      'Близость инфраструктуры',
    ],
  },
  {
    title: 'Поддержка',
    options: [
      'Сопровождение',
      'Помощь с подбором оборудования',
      'Индивидуальный инструктор',
    ],
  },
];
