import { useState } from 'react';
import style from './TravelConstructor.module.scss';
import { cities } from '@/entities/city';
import { countries } from '@/entities/country';
import { ConstructorCart } from '../ConstructorCart';
import { ActivitySelector } from '../ActivitySelector';
import { AccommodationSelector } from '../AccommodationSelector';
import { TransferSelector } from '../TransferSelector';
import { GuestSelector } from '../GuestSelector';
import { SkiLevelSelector } from '../SkiLevelSelector';
import { AdditionalOptionsSelector } from '../AdditionalOptionsSelector';
import { DateRangePicker } from '../DateRangePicker';
import { useConstructor } from '@/widgets/travel-constructor/model/constructorStore';
import type { ConstructorSelectionId } from '@/widgets/travel-constructor/model/types';
import { formatTripDates } from '@/widgets/travel-constructor/lib/formatters';
import { formatGuestSummary } from '@/widgets/travel-constructor/lib/guestSummary';
import { formatSelectionSummary } from '@/widgets/travel-constructor/lib/selectionSummary';
import { INITIAL_OPEN_ITEMS } from '@/widgets/travel-constructor/config/constructorSections';
import {
  MapMarkerIcon,
  RoadFinishIcon,
  CalendarIcon,
  MountainRoadIcon,
  HotelIcon,
  TaxiIcon,
  PeopleIcon,
  SkilLevelIcon,
  ShieldIcon,
} from '@/assets/icons/constructor';
import { LocationSelector } from './LocationSelector';
import {
  TravelConstructorSections,
  type ConstructorItem,
} from './TravelConstructorSections';

export function TravelConstructor() {
  const {
    fromCity,
    fromCountry,
    toCity,
    toCountry,
    departureDate,
    returnDate,
    activities,
    liftTypes,
    accommodation,
    transfer,
    people,
    level,
    additional,
    activeSelectorId,
    setFromCity,
    setFromCountry,
    setToCity,
    setToCountry,
    setDepartureDate,
    setReturnDate,
    setActivities,
    setLiftTypes,
    setAccommodation,
    setTransfer,
    setPeople,
    setLevel,
    setAdditional,
    setActiveSelectorId,
  } = useConstructor();

  const [openItems, setOpenItems] = useState(INITIAL_OPEN_ITEMS);
  const [showAdditional, setShowAdditional] = useState(false);

  const displayValueFrom = fromCountry?.name ?? fromCity?.name;
  const displayValueTo = toCountry?.name ?? toCity?.name;
  const displayWhenDate = formatTripDates(departureDate, returnDate);
  const displayActivity = formatSelectionSummary([...activities, ...liftTypes]);
  const displayAccommodation = accommodation?.name;
  const displayTransfer = transfer?.label;
  const displayPeople = people ? formatGuestSummary(people) : undefined;
  const displayLevel = level ?? undefined;
  const displayAdditional = formatSelectionSummary(additional);

  const toggleItem = (itemId: ConstructorSelectionId) => {
    const shouldOpen = !openItems[itemId];

    setOpenItems({
      ...INITIAL_OPEN_ITEMS,
      [itemId]: shouldOpen,
    });
    setActiveSelectorId(shouldOpen ? itemId : null);
  };

  const closeItem = (itemId: ConstructorSelectionId) => {
    setOpenItems((currentItems) => ({
      ...currentItems,
      [itemId]: false,
    }));
    setActiveSelectorId(null);
  };

  const toggleAdditionalItems = () => {
    const shouldShow = !showAdditional;

    setShowAdditional(shouldShow);

    if (!shouldShow) {
      setOpenItems((currentItems) => ({
        ...currentItems,
        people: false,
        level: false,
        additional: false,
      }));

      if (
        activeSelectorId === 'people'
        || activeSelectorId === 'level'
        || activeSelectorId === 'additional'
      ) {
        setActiveSelectorId(null);
      }
    }
  };

  const mainItems: ConstructorItem[] = [
    {
      id: 'from',
      icon: <MapMarkerIcon />,
      title: 'Откуда едем?',
      description: 'Например "Москва"',
      value: displayValueFrom,
      children: (
        <LocationSelector
          cities={cities}
          countries={countries}
          idPrefix="from"
          onCitySelect={(city) => {
            setFromCity(city);
            setFromCountry(null);
          }}
          onComplete={() => closeItem('from')}
          onCountrySelect={(country) => {
            setFromCountry(country);
            setFromCity(null);
          }}
        />
      ),
    },
    {
      id: 'to',
      icon: <RoadFinishIcon />,
      title: 'Куда едем?',
      description: 'Например "Москва"',
      value: displayValueTo,
      children: (
        <LocationSelector
          cities={cities}
          countries={countries}
          idPrefix="to"
          onCitySelect={(city) => {
            setToCity(city);
            setToCountry(null);
          }}
          onComplete={() => closeItem('to')}
          onCountrySelect={(country) => {
            setToCountry(country);
            setToCity(null);
          }}
        />
      ),
    },
    {
      id: 'when',
      icon: <CalendarIcon />,
      title: 'Когда?',
      description: 'Выберите удобные дни',
      value: displayWhenDate,
      isComplete: Boolean(departureDate && returnDate),
      children: (
        <DateRangePicker
          departureDate={departureDate}
          onChange={({ from, to }) => {
            setDepartureDate(from);
            setReturnDate(to);
          }}
          onComplete={() => closeItem('when')}
          returnDate={returnDate}
        />
      ),
    },
    {
      id: 'activity',
      icon: <MountainRoadIcon />,
      title: 'Чем займемся?',
      description: 'Например, для "Фристайл"',
      value: displayActivity,
      isComplete: Boolean(activities.length || liftTypes.length),
      children: (
        <ActivitySelector
          onActivitiesChange={setActivities}
          onLiftTypesChange={setLiftTypes}
          selectedActivities={activities}
          selectedLiftTypes={liftTypes}
        />
      ),
    },
    {
      id: 'hotel',
      icon: <HotelIcon />,
      title: 'Где остановимся?',
      description: 'Подберите удобный вариант',
      value: displayAccommodation,
      isComplete: Boolean(accommodation),
      children: (
        <AccommodationSelector
          onSelect={setAccommodation}
          selectedAccommodationId={accommodation?.id ?? null}
        />
      ),
    },
    {
      id: 'transfer',
      icon: <TaxiIcon />,
      title: 'Трансфер',
      description: 'Для комфортного передвижения',
      value: displayTransfer,
      children: (
        <TransferSelector
          onChange={setTransfer}
          onComplete={() => closeItem('transfer')}
          value={transfer}
        />
      ),
    },
  ];

  const additionalItems: ConstructorItem[] = [
    {
      id: 'people',
      icon: <PeopleIcon />,
      title: 'Кто едет?',
      description: 'Состав поездки',
      value: displayPeople,
      children: (
        <GuestSelector
          onChange={setPeople}
          value={people}
        />
      ),
    },
    {
      id: 'level',
      icon: <SkilLevelIcon />,
      title: 'Уровень катания',
      description: 'Например "Новичок"',
      value: displayLevel,
      children: (
        <SkiLevelSelector
          onChange={setLevel}
          value={level}
        />
      ),
    },
    {
      id: 'additional',
      icon: <ShieldIcon />,
      title: 'Дополнительные возможности',
      description: 'Особые условия',
      value: displayAdditional,
      children: (
        <AdditionalOptionsSelector
          onChange={setAdditional}
          selectedOptions={additional}
        />
      ),
    },
  ];

  return (
    <section className={style.travelConstructor}>
      <div className={style.selectionList}>
        <TravelConstructorSections
          items={mainItems}
          onToggle={toggleItem}
          openItems={openItems}
        />

        <button
          className={style.showMoreButton}
          onClick={toggleAdditionalItems}
          type="button"
        >
          {showAdditional ? 'Скрыть дополнительные услуги' : 'Дополнительные услуги +'}
        </button>

        {showAdditional && (
          <TravelConstructorSections
            items={additionalItems}
            onToggle={toggleItem}
            openItems={openItems}
          />
        )}
      </div>

      <ConstructorCart />
    </section>
  );
}