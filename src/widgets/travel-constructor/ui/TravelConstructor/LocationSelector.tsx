import { useEffect, useMemo, useRef, useState } from 'react';

import { AlertIcon } from '@/assets/icons/constructor';
import type { City } from '@/entities/city';
import type { Country } from '@/entities/country';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { SearchInput } from '@/shared/ui/base/SearchInput';

import { CitySelector } from '../CitySelector';
import { CountrySelector } from '../CountrySelector';

import styles from './LocationSelector.module.scss';

const MIN_SEARCH_LENGTH = 3;

interface LocationSelectorProps {
  idPrefix: string;
  cities: City[];
  countries: Country[];
  onCitySelect: (city: City) => void;
  onCountrySelect: (country: Country) => void;
  onComplete: () => void;
  onCitySearch?: (query: string) => Promise<void>;
}

export function LocationSelector({
  idPrefix,
  cities,
  countries,
  onCitySelect,
  onCountrySelect,
  onComplete,
  onCitySearch,
}: Readonly<LocationSelectorProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialSearchRef = useRef(true);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ru-RU');

  const isShortQuery =
    normalizedQuery.length > 0 &&
    normalizedQuery.length < MIN_SEARCH_LENGTH;

  useEffect(() => {
    if (!onCitySearch) {
      return;
    }

    if (isInitialSearchRef.current) {
      isInitialSearchRef.current = false;
      return;
    }

    const query = searchQuery.trim();

    if (query.length > 0 && query.length < MIN_SEARCH_LENGTH) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onCitySearch(query);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [onCitySearch, searchQuery]);

  const filteredCountries = useMemo(() => {
    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter((country) =>
      country.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery),
    );
  }, [countries, normalizedQuery]);

  const hasResults = cities.length > 0 || filteredCountries.length > 0;

  const completeCitySelection = (city: City) => {
    onCitySelect(city);
    setSearchQuery('');
    onComplete();
  };

  const completeCountrySelection = (country: Country) => {
    onCountrySelect(country);
    setSearchQuery('');
    onComplete();
  };

  return (
    <>
      <SearchInput
        id={`city-search-${idPrefix}`}
        name={`city-search-${idPrefix}`}
        onChange={setSearchQuery}
        placeholder="Начните вводить название"
        value={searchQuery}
      />

      {isShortQuery ? (
        <p className={styles.searchHint}>
          Введите минимум 3 символа для поиска
        </p>
      ) : null}

      {hasResults ? (
        <>
          <CitySelector
            cities={cities}
            onSelect={completeCitySelection}
          />

          {filteredCountries.length > 0 ? (
            <CountrySelector
              countries={filteredCountries}
              onSelect={completeCountrySelection}
            />
          ) : null}
        </>
      ) : (
        <EmptyState
          description="Проверьте написание — или выберите город из списка."
          icon={<AlertIcon aria-hidden="true" />}
          title="Город не найден"
        />
      )}
    </>
  );
}