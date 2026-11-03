import type { ReactNode } from 'react';
import { useState } from 'react';

import { ClockIcon, QuestionMarkFilledIcon, NoConnectionIcon } from '@/assets/icons';
import { Tabs } from '@/shared/ui/base/Tabs';
import { Button } from '@/shared/ui/Button';
import { DraftTourCard, type DraftTourCardProps } from '@/shared/ui/compose/DraftTourCard';
import { TourCard, type TourCardProps } from '@/shared/ui/compose/TourCard';

import style from './MyToursPage.module.scss';

type DraftTrip = { status: 'process' } & DraftTourCardProps;
type TourTrip = { status: 'active' | 'booking' | 'archive' } & TourCardProps;
type Trip = DraftTrip | TourTrip;

const ALL_TOURS: Trip[] = [
  {
    status: 'active',
    imageSrc: '/assets/images/constructor/accommodation-belaya-gora.jpg',
    destination: 'Шерегеш, Россия',
    dates: '18 - 28 января',
    duration: '10 ночей',
    activities: [{ label: 'Фрирайд' }],
    guests: '2 взрослых, 1 ребёнок',
    accommodation: 'Alpen Club',
    transfer: 'Трансфер',
    priceLine: { value: '45 600 ₽', caption: 'за 2 взрослых и 1 ребёнка' },
  },
  {
    status: 'process',
    destination: 'Шерегеш, Россия',
    createdAt: 'Создан 20 сентября',
    statusText: 'не завершён',
    progress: 67,
    progressText: 'Заполнено 4 из 6 параметров',
    details: [
      { city: 'Шерегеш' },
      { date: '17 - 22 марта' },
      { activity: 'Фристайл' },
      { hotel: 'Апартаменты' },
    ],
    hints: 'откуда едете, состав команды, трансфер, уровень катания.',
  },
  {
    status: 'process',
    destination: 'Направление не выбрано',
    createdAt: 'Создан 10 сентября',
    statusText: 'не завершён',
    progress: 17,
    progressText: 'Заполнено 1 из 6 параметров',
    details: [{ date: '18 - 28 января' }],
    hints: 'откуда едете, состав команды, трансфер, уровень катания.',
  },
  {
    status: 'booking',
    imageSrc: '/assets/images/constructor/accommodation-sensa-room.jpg',
    destination: 'Домбай, Карачаево-Черкесия',
    dates: '5 - 10 марта',
    duration: '5 ночей',
    activities: [{ label: 'Фристайл' }],
    guests: '2 взрослых',
    accommodation: 'Отель 4+',
    priceLine: { value: '36 200 ₽', caption: 'за человека' },
  },
  {
    status: 'archive',
    imageSrc: '/assets/images/constructor/accommodation-iset.jpg',
    destination: 'Роза Хутор, Сочи',
    dates: '10 - 17 июня 2024',
    duration: '7 ночей',
    activities: [{ label: 'Трассовое катание' }],
    guests: '2 взрослых',
    accommodation: "Отель 'Grand'",
    priceLine: { value: '42 000 ₽', caption: 'за 2 взрослых' },
  },
];

const isDraftTrip = (trip: Trip): trip is DraftTrip => trip.status === 'process';

const groupBy = <T extends Trip>(status: T['status'], tours: Trip[]): T[] =>
  tours.filter((tour) => tour.status === status) as T[];

const ACTIVE_TOURS = groupBy<TourTrip>('active', ALL_TOURS);
const PROCESS_TOURS = groupBy<DraftTrip>('process', ALL_TOURS);
const BOOKING_TOURS = groupBy<TourTrip>('booking', ALL_TOURS);
const ARCHIVE_TOURS = groupBy<TourTrip>('archive', ALL_TOURS);

const IS_SERVER_ERROR = false;

const TABS = [
  { id: 'active', label: 'Активные', count: ACTIVE_TOURS.length, countVariant: 'blue' as const },
  {
    id: 'drafts',
    label: 'Незавершённые',
    count: PROCESS_TOURS.length + BOOKING_TOURS.length,
    countVariant: 'orange' as const,
  },
  {
    id: 'archive',
    label: 'Архив',
    count: ARCHIVE_TOURS.length,
    countVariant: 'gray' as const,
  },
];

const RESUME_TOUR = PROCESS_TOURS[0];

function MyToursPage() {
  const [activeTab, setActiveTab] = useState('active');

  const startNewTrip = () => {
    window.location.assign('/trip-builder');
  };

  const renderServerError = () => (
    <div className={style.serverError}>
      <NoConnectionIcon className={style.serverError__icon} />
      <div className={style.serverError__text}>
        <div className={style.serverError__title}>{'Ой, кажется что-то сломалось'}</div>
        <div className={style.serverError__description}>
          {'Попробуйте обновить через пару минут.'}
        </div>
      </div>
    </div>
  );

  const renderEmpty = () => <div className={style.empty}>{'Вы пока еще не добавили туры'}</div>;

  const renderSection = (title: string, cards: ReactNode) => (
    <section className={style.mytours__section}>
      <h2 className={style.mytours__sectionTitle}>{title}</h2>
      <div className={style.mytours__cards}>{cards}</div>
    </section>
  );

  const renderActiveSection = () =>
    renderSection(
      'Активные',
      ACTIVE_TOURS.map((tour) => (
        <TourCard
          key={tour.destination}
          {...tour}
          onShare={() => {
            console.log('share');
          }}
          onPlan={() => {
            console.log('plan');
          }}
        />
      )),
    );

  const renderDraftsSection = () =>
    renderSection(
      'Черновики — в процессе сборки',
      PROCESS_TOURS.map((tour) => (
        <DraftTourCard
          key={`${tour.destination ?? ''}${tour.createdAt ?? ''}`}
          {...tour}
          onDelete={() => {
            console.log('delete');
          }}
          onContinue={() => {
            console.log('continue');
          }}
        />
      )),
    );

  const renderBookingSection = () =>
    renderSection(
      'Поездка собрана. Продолжите оформление на сайте партнёров.',
      BOOKING_TOURS.map((tour) => (
        <TourCard
          key={tour.destination}
          {...tour}
          onEdit={() => {
            console.log('edit');
          }}
          onBooking={() => {
            console.log('booking');
          }}
        />
      )),
    );

  const renderArchiveSection = () =>
    renderSection(
      'Архив',
      ARCHIVE_TOURS.map((tour) => (
        <TourCard
          key={tour.destination}
          {...tour}
          onRepeat={() => {
            console.log('repeat');
          }}
        />
      )),
    );

  const renderTabState = (toursCount: number, renderTours: () => ReactNode) => {
    if (toursCount === 0) {
      return IS_SERVER_ERROR ? renderServerError() : renderEmpty();
    }
    return renderTours();
  };

  const renderActiveTab = () => (
    <>
      {renderTabState(ACTIVE_TOURS.length, renderActiveSection)}

      <div className={style.cta}>
        <div className={style.cta__info}>
          <QuestionMarkFilledIcon className={style.cta__icon} />
          <div className={style.cta__text}>{'Готовы планировать новое приключение?'}</div>
        </div>
        <Button
          variant="outline"
          text="Собрать поездку"
          onClick={startNewTrip}
          icon="material-symbols:arrow-forward-rounded"
          iconPosition="right"
        />
      </div>
    </>
  );

  const renderDraftsTab = () => {
    const toursCount = PROCESS_TOURS.length + BOOKING_TOURS.length;
    if (toursCount === 0) {
      return IS_SERVER_ERROR ? renderServerError() : renderEmpty();
    }
    return (
      <>
        {PROCESS_TOURS.length > 0 && renderDraftsSection()}
        {BOOKING_TOURS.length > 0 && renderBookingSection()}
      </>
    );
  };

  const renderArchiveTab = () => renderTabState(ARCHIVE_TOURS.length, renderArchiveSection);

  const renderResumeTourDates = () => {
    if (!RESUME_TOUR || !isDraftTrip(RESUME_TOUR)) {
      return null;
    }

    return RESUME_TOUR.details?.find((detail) => 'date' in detail)?.date;
  };

  return (
    <div className={style.mytours}>
      <div className={style.mytours__inner}>
        <div className={style.mytours__head}>
          <h1 className={style.mytours__title}>{'Мои туры'}</h1>
          <p className={style.mytours__subtitle}>
            {'Активные, незавершённые, архивные - все поездки в одном месте.'}
          </p>
        </div>

        {activeTab === 'active' && RESUME_TOUR && (
          <div className={style.resume}>
            <div className={style.resume__info}>
              <ClockIcon className={style.resume__icon} />
              <div className={style.resume__content}>
                <div className={style.resume__title}>
                  {'Эта поездка не собрана до конца, вернёмся к ней?'}
                </div>
                <div className={style.resume__meta}>
                  <span>{RESUME_TOUR.destination}</span>
                  <i
                    className={style.resume__dot}
                    aria-hidden="true"
                  />
                  {renderResumeTourDates() && <span>{renderResumeTourDates()}</span>}
                  <i
                    className={style.resume__dot}
                    aria-hidden="true"
                  />
                  <span>{RESUME_TOUR.progressText}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              text="Продолжить"
              onClick={() => {
                console.log('resume');
              }}
              icon="material-symbols:arrow-forward-rounded"
              iconPosition="right"
            />
          </div>
        )}

        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className={style.mytours__list}>
          {activeTab === 'active' && renderActiveTab()}
          {activeTab === 'drafts' && renderDraftsTab()}
          {activeTab === 'archive' && renderArchiveTab()}
        </div>
      </div>
    </div>
  );
}

export default MyToursPage;
