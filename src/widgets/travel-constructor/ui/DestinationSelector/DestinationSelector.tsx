import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { AlertIcon } from '@/assets/icons/constructor';
import type { City } from '@/entities/city';
import { MOCK_RESORTS, ResortCard, ResortDetailsModal, type Resort } from '@/entities/resort';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { CardList } from '@/shared/ui/CardList';
import { useConstructor } from '@/widgets/travel-constructor/model/constructorStore';

import { PlaceSelector } from '../PlaceSelector';

import styles from './DestinationSelector.module.scss';

interface DestinationSelectorProps {
  cities: City[];
  isCitiesLoading: boolean;
  citiesError: Error | null;
  onCitySearch: (query: string) => Promise<void>;
  onCitySelect: (city: City) => void;
  onComplete: () => void;
  resorts?: readonly Resort[];
}

export function DestinationSelector({
  cities,
  isCitiesLoading,
  citiesError,
  onCitySearch,
  onCitySelect,
  onComplete,
  resorts = MOCK_RESORTS,
}: Readonly<DestinationSelectorProps>) {
  const location = useLocation();
  const selectedResort = useConstructor((state) => state.selectedResort);
  const setSelectedResort = useConstructor((state) => state.setSelectedResort);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsResort, setDetailsResort] = useState<Resort | null>(null);
  const filteredResorts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('ru-RU');
    return query
      ? resorts.filter((resort) =>
          [resort.name, resort.cityName, resort.location].some((name) =>
            name.toLocaleLowerCase('ru-RU').includes(query),
          ),
        )
      : resorts;
  }, [resorts, searchQuery]);

  const selectResort = (resort: Resort) => {
    if (resort.isOpen) setSelectedResort(resort);
  };

  return (
    <>
      <PlaceSelector
        idPrefix="to"
        cities={cities}
        isCitiesLoading={isCitiesLoading}
        citiesError={citiesError}
        onCitySearch={onCitySearch}
        onCitySelect={onCitySelect}
        onComplete={onComplete}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Начните вводить название курорта, а мы подскажем"
        searchAriaLabel="Поиск курорта или города"
        minSearchHint="Введите минимум 3 символа для поиска городов"
        emptyState={
          filteredResorts.length ? null : (
            <EmptyState
              title="Ничего не найдено"
              description="Проверьте название курорта или города."
              icon={<AlertIcon aria-hidden="true" />}
            />
          )
        }
      >
        <div className={styles.resortsSection}>
          {filteredResorts.length > 0 && (
            <section
              className={styles.preview}
              aria-label="Список курортов"
              tabIndex={0}
            >
              <CardList className={styles.cards}>
                {filteredResorts.map((resort) => (
                  <ResortCard
                    key={resort.id}
                    resort={resort}
                    variant="compact"
                    isSelected={selectedResort?.id === resort.id}
                    onSelect={selectResort}
                    onDetails={setDetailsResort}
                  />
                ))}
              </CardList>
            </section>
          )}
          <Link
            className={styles.showAll}
            to="/trip-builder/resorts"
            state={location.state}
          >
            Показать все курорты
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 12h16m-7-7 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </PlaceSelector>
      <ResortDetailsModal
        resort={detailsResort}
        isSelected={detailsResort?.id === selectedResort?.id}
        onClose={() => setDetailsResort(null)}
        onSelect={selectResort}
      />
    </>
  );
}
