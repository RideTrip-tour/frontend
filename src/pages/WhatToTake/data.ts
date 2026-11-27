export type ChecklistItem = {
  id: string;
  label: string;
};

export type ChecklistGroup = {
  title?: string;
  description?: string;
  items: ChecklistItem[];
};

export type ChecklistSection = {
  id: string;
  title: string;
  icon: string;
  intro?: string;
  groups: ChecklistGroup[];
  tip?: string;
  afterword?: string;
};

export const checklistSections: ChecklistSection[] = [
  {
    id: 'documents',
    title: 'Документы и деньги',
    icon: 'solar:clipboard-check-bold',
    groups: [
      {
        items: [
          { id: 'passport', label: 'Паспорт' },
          { id: 'tickets', label: 'Билеты и подтверждения бронирований' },
          {
            id: 'driving-license',
            label: 'Водительские права, если планируете арендовать автомобиль',
          },
          { id: 'cash', label: 'Небольшая сумма наличных' },
          {
            id: 'insurance',
            label:
              'Медицинская страховка (убедитесь, что покрывает горнолыжный спорт или сноуборд)',
          },
          {
            id: 'bank-card',
            label:
              'Банковская карта, и возможно кредитка, которая сможет помочь в непредвиденных ситуациях',
          },
        ],
      },
    ],
    tip: 'Совет: сохраните копии документов и бронирований в телефоне или облаке. Лучше иметь к ним доступ даже без интернета.',
  },
  {
    id: 'health',
    title: 'Аптечка и защита',
    icon: 'solar:medical-kit-bold',
    groups: [
      {
        items: [
          {
            id: 'medicine',
            label: 'Привычные личные лекарства с запасом (обезболивающее, антигистаминное)',
          },
          { id: 'sunscreen', label: 'Солнцезащитный крем' },
          { id: 'bandages', label: 'Пластыри' },
          { id: 'lip-balm', label: 'Бальзам для губ' },
          { id: 'blister-plasters', label: 'Пластыри от мозолей' },
          { id: 'sunglasses', label: 'Солнцезащитные очки' },
          { id: 'first-aid', label: 'Базовые средства первой помощи' },
        ],
      },
    ],
    tip: 'Важно: если рассчитываете на страховку — заранее проверьте, покрывает ли она выбранную активность и связанные с ней риски.',
  },
  {
    id: 'tech',
    title: 'Техника и связь',
    icon: 'solar:devices-bold',
    groups: [
      {
        items: [
          { id: 'phone', label: 'Телефон' },
          { id: 'camera', label: 'Камера или экшн-камера' },
          { id: 'charger', label: 'Зарядка' },
          { id: 'headphones', label: 'Наушники' },
          { id: 'power-bank', label: 'Пауэрбанк' },
          { id: 'adapter', label: 'Переходник для розетки, если нужен' },
        ],
      },
    ],
    tip: 'Совет: на морозе аккумулятор разряжается быстрее. Пауэрбанк и телефон лучше не оставлять надолго на холоде.',
    afterword:
      'И ещё одна маленькая, но полезная вещь: скачайте карту курорта, если она доступна офлайн. Связь иногда любит взять выходной.',
  },
  {
    id: 'clothes',
    title: 'Одежда для гор',
    icon: 'solar:t-shirt-bold',
    intro: 'В горах работает простое правило: лучше несколько слоёв, чем одна очень тёплая вещь.',
    groups: [
      {
        title: 'Первый слой',
        items: [
          { id: 'thermal-underwear', label: 'Термобельё' },
          { id: 'balaclava', label: 'Бафф или тонкая шапка под шлем' },
          { id: 'ski-socks', label: 'Носки для катания' },
        ],
      },
      {
        title: 'Второй слой',
        items: [
          { id: 'fleece', label: 'Флиска или лёгкая утепляющая куртка' },
          { id: 'warm-trousers', label: 'Тёплые брюки или легинсы' },
        ],
      },
      {
        title: 'Верхний слой',
        items: [
          { id: 'ski-jacket', label: 'Горнолыжная куртка' },
          { id: 'helmet', label: 'Шлем' },
          { id: 'ski-trousers', label: 'Горнолыжные брюки' },
          { id: 'ski-mask', label: 'Горнолыжная маска' },
          { id: 'gloves', label: 'Перчатки или варежки' },
          { id: 'spare-lens', label: 'Запасная линза для маски, если есть' },
          { id: 'spare-gloves', label: 'Запасные перчатки или варежки' },
        ],
      },
      {
        title: 'Для отдыха после катания',
        items: [
          { id: 'warm-shoes', label: 'Тёплая обувь' },
          { id: 'swimsuit', label: 'Купальник и шлёпанцы, если в отеле есть бассейн или SPA' },
          { id: 'casual-clothes', label: 'Удобная одежда' },
        ],
      },
    ],
    tip: 'Совет: проверьте прогноз за несколько дней до поездки. Если обещают сильный мороз, пригодятся дополнительные утепляющие слои и тёплые стельки.',
  },
  {
    id: 'equipment',
    title: 'Снаряжение',
    icon: 'solar:skiing-bold',
    groups: [
      {
        title: 'Если едете со своим',
        items: [
          { id: 'skis', label: 'Лыжи или сноуборд' },
          { id: 'equipment-case', label: 'Чехол для снаряжения' },
          { id: 'boots', label: 'Ботинки' },
          { id: 'backpack', label: 'Рюкзак' },
          { id: 'poles', label: 'Палки' },
          { id: 'care-kit', label: 'Всё необходимое для ухода за снаряжением' },
        ],
      },
    ],
    tip: 'Совет: если летите самолётом, прокат может заметно упростить жизнь и уменьшить количество багажа.',
    afterword:
      'Если планируете брать снаряжение в прокате — заранее проверьте условия аренды и что входит в комплект.',
  },
  {
    id: 'lifehacks',
    title: 'Лайфхаки от команды «Зшагаю»',
    icon: 'solar:heart-bold',
    groups: [
      {
        items: [
          { id: 'buff', label: 'Бафф вместо шарфа' },
          { id: 'long-cable', label: 'Длинный кабель для зарядки' },
          { id: 'extra-gloves', label: 'Запасные перчатки на случай снега и мокрых рукавиц' },
          { id: 'waterproof-bag', label: 'Непромокаемый пакет для мокрых вещей' },
          { id: 'thermos', label: 'Термос для горячего напитка' },
          {
            id: 'room-number',
            label:
              'Запишите номер комнаты в отеле — в телефон, а если хочется совсем надёжно, то и на бумагу',
          },
          { id: 'insoles', label: 'Тёплые стельки, если мёрзнут ноги' },
          {
            id: 'new-equipment',
            label: 'Не устраивайте тест-драйв совершенно новой экипировки в первый день катания',
          },
        ],
      },
      {
        title: 'Перед выездом',
        items: [
          { id: 'check-documents', label: 'Проверить срок действия паспорта и страховки' },
          { id: 'download-map', label: 'Скачать карту курорта' },
          { id: 'check-weather', label: 'Посмотреть прогноз' },
          { id: 'charge-devices', label: 'Зарядить технику и пауэрбанк' },
          { id: 'offline-tickets', label: 'Сохранить билеты и брони офлайн' },
        ],
      },
    ],
  },
];

export const defaultCheckedItemIds = [
  'passport',
  'tickets',
  'phone',
  'charger',
  'thermal-underwear',
];
