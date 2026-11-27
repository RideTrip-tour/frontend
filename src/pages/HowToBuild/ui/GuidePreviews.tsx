import type { ComponentType, ReactNode, SVGProps } from 'react';

import {
  CalendarIcon,
  CheckmarkIcon,
  MapMarkerIcon,
  MountainRoadIcon,
  PeopleIcon,
  RoadFinishIcon,
  SkilLevelIcon,
  TaxiIcon,
} from '@/assets/icons/constructor';

import style from './GuidePreviews.module.scss';

interface CalloutProps {
  children: ReactNode;
  placement: 'above' | 'below' | 'side';
}

function Callout({ children, placement }: CalloutProps) {
  return (
    <span className={`${style.callout} ${style[placement]}`}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 80 56"
        fill="none"
      >
        <path
          d="M1 10C43-4 96 4 62 53"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray="9 11"
        />
        <path
          d="m62 48-1 5 5-1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface PreviewItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  detail: string;
}

interface PreviewRow extends PreviewItem {
  status: 'Добавить' | 'Изменить' | 'Готово';
  callout?: { label: string; placement: 'above' | 'below' };
}

const directionRows: PreviewRow[] = [
  {
    icon: MapMarkerIcon,
    title: 'Откуда едем?',
    detail: 'Например, «Москва»',
    status: 'Добавить',
  },
  {
    icon: RoadFinishIcon,
    title: 'Куда едем?',
    detail: 'Шерегеш (Россия)',
    status: 'Готово',
    callout: { label: 'Выбирайте направление', placement: 'above' },
  },
  {
    icon: CalendarIcon,
    title: 'Когда?',
    detail: '5–10 января',
    status: 'Готово',
    callout: { label: 'Выбирайте даты', placement: 'below' },
  },
  {
    icon: MountainRoadIcon,
    title: 'Чем займёмся?',
    detail: 'Например, «Фрирайд»',
    status: 'Добавить',
  },
];

const preferencesRows: PreviewRow[] = [
  {
    icon: TaxiIcon,
    title: 'Трансфер',
    detail: 'Не нужен трансфер',
    status: 'Изменить',
  },
  {
    icon: PeopleIcon,
    title: 'Кто едет?',
    detail: '1 взрослый, 1 ребёнок (4–12 лет)',
    status: 'Готово',
    callout: { label: 'Ваша компания', placement: 'above' },
  },
  {
    icon: SkilLevelIcon,
    title: 'Уровень катания',
    detail: 'Новичок',
    status: 'Готово',
    callout: { label: 'Ваше мастерство', placement: 'below' },
  },
];

const itinerary: PreviewItem[] = [
  { icon: MapMarkerIcon, title: 'Шерегеш', detail: 'Россия, Кемеровская обл.' },
  { icon: CalendarIcon, title: '5–10 января', detail: '5 ночей' },
  { icon: MountainRoadIcon, title: 'Фрирайд', detail: 'Активность' },
  { icon: SkilLevelIcon, title: 'Новичок', detail: 'Уровень катания' },
];

function PreviewRows({ rows }: { rows: PreviewRow[] }) {
  return (
    <ul className={style.rows}>
      {rows.map(({ icon: Icon, title, detail, status, callout }) => (
        <li
          className={style.row}
          data-complete={status === 'Готово'}
          key={title}
        >
          <span className={style.rowIcon}>
            <Icon aria-hidden="true" />
          </span>
          <div>
            <p className={style.rowTitle}>{title}</p>
            <p className={style.rowDetail}>{detail}</p>
          </div>
          <span className={style.status}>
            {status}
            {status === 'Готово' ? (
              <CheckmarkIcon aria-hidden="true" />
            ) : (
              <span aria-hidden>+</span>
            )}
          </span>
          {callout && <Callout placement={callout.placement}>{callout.label}</Callout>}
        </li>
      ))}
    </ul>
  );
}

export function DirectionPreview() {
  return (
    <figure
      className={style.preview}
      aria-label="Пример выбора направления и дат"
    >
      <PreviewRows rows={directionRows} />
    </figure>
  );
}

export function PreferencesPreview() {
  return (
    <figure
      className={`${style.preview} ${style.preferences}`}
      aria-label="Пример настроек поездки"
    >
      <PreviewRows rows={preferencesRows} />
    </figure>
  );
}

export function ResultsPreview() {
  return (
    <figure
      className={`${style.preview} ${style.results}`}
      aria-label="Пример результатов подбора"
    >
      <div className={style.summary}>
        <Callout placement="above">Ваш выбор</Callout>
        <p>Ваше путешествие</p>
        <ul className={style.itinerary}>
          {itinerary.map(({ icon: Icon, title, detail }) => (
            <li key={title}>
              <Icon aria-hidden="true" />
              <span>{title}</span>
              <small>{detail}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className={style.filters}>
        <Callout placement="side">Фильтры</Callout>
        {['Цена', 'Проживание', 'Рейтинг'].map((filter) => (
          <span
            className={style.filter}
            key={filter}
          >
            {filter}
          </span>
        ))}
      </div>
      <div className={style.offer}>
        <Callout placement="below">Подходящие варианты</Callout>
        <img
          src="/assets/images/imageBG.png"
          alt=""
          width="124"
          height="108"
          loading="lazy"
        />
        <div className={style.offerContent}>
          <div className={style.offerHeader}>
            <div>
              <p className={style.offerTitle}>Шерегеш</p>
              <p className={style.offerLocation}>Кемеровская обл., Россия</p>
            </div>
            <p className={style.review}>
              <span aria-hidden="true">★</span> <strong>4,7</strong> | 1 820 отзывов
            </p>
          </div>
          <div className={style.offerFooter}>
            <p>
              Ски-пасс от <strong>2 800 ₽</strong> / день
            </p>
            <span>Выбрать</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
