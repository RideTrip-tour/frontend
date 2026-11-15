import * as avatars from '../assets';
import type { MemberCardData } from './types';

const contactAction = { label: 'Написать', href: '#' };
const portfolioAction = { label: 'Портфолио', href: '#' };

const team: MemberCardData[] = [
  {
    firstName: 'Ирина',
    avatarUrl: avatars.irina,
    lastName: 'Жирнова',
    role: 'Project Manager',
    bio: [
      'Местный решала. Держит в фокусе задачи, сроки, людей и всё остальное, что каким-то образом должно однажды превратиться в работающий продукт.',
      'В свободное от решений время она в походах, на горе или несётся к новым горизонтам. Команда её очень боится любит, поэтому старается не отвлекать.',
    ],
    skills: ['Yougile', 'Scrum', 'Kanban', 'Miro', 'Notion', 'Google Таблицы'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Виктор',
    avatarUrl: avatars.viktor,
    lastName: 'Балонкин',
    role: 'Backend Developer',
    bio: [
      'Отвечает за бэкенд и немного DevOps: межсервисное взаимодействие, ревью кода, стабильность системы и всё то, что должно работать, даже если пользователь никогда об этом не узнает.',
      'Райдер и походник, поэтому в “Зшагадо” пришёл не только с технической экспертизой, но и с личным пониманием проблемы. Любит ходить с тяжёлым рюкзаком. Желательно в гору. Чем круче, тем лучше.',
    ],
    skills: ['Python', 'Microservises', 'REST API', 'Celery', 'PostgreSQL', 'Docker'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Кристина',
    avatarUrl: avatars.kristina,
    lastName: 'Абанина',
    role: 'UI/UX - designer',
    bio: [
      'Проектирует интерфейсы “Зшагадо”: от главной страницы до конструктора. Даже самые мельчайшие детали сайта - всегда симбиоз ее исследований и эстетического подхода.',
      'Придя в проект дизайнером, заодно освоила курс горнолыжной философии: трансферы, уровни катания, особенности экипировки и прочие радости теперь навсегда части ее души.',
    ],
    skills: ['Figma', 'UX -исследования', 'Интервью', 'Photoshop', 'Гайдлайны iOS и Android'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Филипп',
    avatarUrl: avatars.filipp,
    lastName: 'Гладышев',
    role: 'Frontend Developer',
    bio: [
      'Отвечает за то, чтобы “Зшагадо” работал быстро, плавно и стабильно. В проекте ценит его практичность, команду и атмосферу.',
      'Филипп не самый разговорчивый участник команды, но уверен что если бы “Зшагадо” был человеком, он бы рассказывал всё, что знает, ещё до того, как ты успеешь спросить.',
    ],
    skills: ['React', 'TypeScript', 'Zustand', 'SASS', 'REST API', 'Framer Motion'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Тамара',
    avatarUrl: avatars.tamara,
    lastName: 'Текликиди',
    role: 'Quality Assurance',
    bio: [
      'Ищет то, что команда очень надеялась не найти. Там, где остальные видят готовый сценарий, Тамара может увидеть ещё один способ его сломать.',
      '«А что будет, если…?» - один из главных профессиональных вопросов в жизни Тамары. И боль разработчиков команды. Но это уже совсем другая история.',
    ],
    skills: ['REST API', 'SQL', 'Postman', 'DevTools', 'Тест-анализ'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Вячеслав',
    avatarUrl: avatars.vyacheslav,
    lastName: 'Касаткин',
    role: 'System Analyst',
    bio: [
      'Если коротко, системно анализирует. Если по фактам, следит за тем, чтобы за простым пользовательским сценарием не прятался квест.',
      'В жизни Слава тоже любит исследовать миры: реальные и игровые. И уверяет, что “Зшагадо” уже открыл всю карту, отметил лучшие места и обязательно расскажет, где лежит лут.',
    ],
    skills: ['Swagger/OpenAPI', 'BPMN 2.0', 'UML', 'Data Modeling', 'Jira'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Анастасия',
    avatarUrl: avatars.anastasia,
    lastName: 'Суворова',
    role: 'UX Writer',
    bio: [
      'Отвечает за слова “Зшагадо”. Буквально. Поэтому интерфейс говорит понятно, коротко и без языка инструкций к микроволновке.',
      'Переживает за запятые, тональность и за ваши улыбки. Уверяет, что текст на три слова может обсуждаться дольше, чем задача на три дня.',
    ],
    skills: ['UX-текст', 'SEO-копирайтинг', 'Tone of voice'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Евгений',
    avatarUrl: avatars.evgeniy,
    lastName: 'Маслов',
    role: 'Frontend Developer',
    bio: [
      'Строит интерфейс конструктора путешествий на React и TypeScript и превращает задумки из Figma в работающий продукт.',
      'В свободное время Евгений не ищет легких путей и выбирает бег, трейл и лыжные гонки. Триатлон и ультратрейл пока в планах, но уже не за горами.',
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Zustand', 'TanStack Query', 'HTML5', 'CSS3'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Наталья',
    avatarUrl: avatars.natalya,
    lastName: 'Золотко',
    role: 'Quality Assurance',
    bio: [
      'Проверяет “Зшагадо” на прочность: проходит сценарии, ищет баги и пытается найти то место, где «вроде всё работает» внезапно перестаёт быть правдой.',
      'Наталья больше любит море, чем горы. Поэтому дайверы могут спать спокойно — их интересы под защитой.',
    ],
    skills: ['REST API', 'Postman', 'DevTools', 'Python', 'Тест-анализ', 'PyTest', 'Playwright'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Сергей',
    avatarUrl: avatars.sergey,
    lastName: 'Бочарников',
    role: 'Backend Developer',
    bio: [
      'Пишет код, настраивает базы, возится с API - строит всю ту невидимую систему, благодаря которой пользователь просто открывает сайт и всё работает.',
      'Может часами искать сложное решение, перебирать варианты, а потом внезапно обнаружить, что оно всё это время было прямо под носом. Поэтому уверяет, что “Зшагадо” будет готов ко всему.',
    ],
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    contactAction,
    portfolioAction,
  },
  {
    firstName: 'Камилла',
    avatarUrl: avatars.kamilla,
    lastName: 'Илякаева',
    role: 'Backend Developer',
    bio: [
      'Делает то, что не видно, но без чего ничто работать не станет. Любит командную работу и результат, который можно потрогать через фронтендов.',
      'И да, Камилла признается, что она не фанат Marvel, но ее серверы взлетают даже без суперсил.',
    ],
    skills: ['Python', 'FastAPI', 'Docker', 'Dit'],
    contactAction,
    portfolioAction,
  },
];

export const members = team.map((member, i) => ({ ...member, id: String(i) }));
