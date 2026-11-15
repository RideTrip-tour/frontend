import { useEffect, useMemo, useRef, useState } from 'react';

import { AlertIcon } from '@/assets/icons/constructor';
import ConnectionErrorIcon from '@/assets/icons/partner-offers/ConnectionError.svg?react';
import { CityList, type City } from '@/entities/city';
import { CountryList, type Country } from '@/entities/country';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { SearchInput } from '@/shared/ui/base/SearchInput';
import { POPULAR_CITY_NAMES } from '@/widgets/travel-constructor/config/citySelector';

import styles from './DeparturePlaceSelector.module.scss';

const MIN_SEARCH_LENGTH = 3;

interface DeparturePlaceSelectorProps {
  idPrefix: string;
  cities: City[];
  countries: Country[];
  onCitySelect: (city: City) => void;
  onCountrySelect: (country: Country) => void;
  onComplete: () => void;
  onCitySearch?: (query: string) => Promise<void>;
  isCitiesLoading?: boolean;
  isCountriesLoading?: boolean;
  citiesError?: Error | null;
  countriesError?: Error | null;
}

function LocationLoadError() {
  return (
    <EmptyState
      description="Попробуйте обновить через пару минут."
      icon={
        <ConnectionErrorIcon
          aria-hidden="true"
          height={80}
          width={80}
        />
      }
      title="Ой, кажется что-то сломалось"
    />
  );
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase('ru-RU');
}

function removeDuplicateCities(cities: City[]): City[] {
  return Array.from(new Map(cities.map((city) => [normalizeName(city.name), city])).values());
}

export function DeparturePlaceSelector({
  idPrefix,
  cities,
  countries,
  onCitySelect,
  onCountrySelect,
  onComplete,
  onCitySearch,
  isCitiesLoading = false,
  isCountriesLoading = false,
  citiesError = null,
  countriesError = null,
}: Readonly<DeparturePlaceSelectorProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialSearchRef = useRef(true);
  const normalizedQuery = normalizeName(searchQuery);
  const isShortQuery = normalizedQuery.length > 0 && normalizedQuery.length < MIN_SEARCH_LENGTH;

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
    const filtered = normalizedQuery
      ? countries.filter((country) => normalizeName(country.name).includes(normalizedQuery))
      : countries;

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [countries, normalizedQuery]);

  const sortedCities = useMemo(
    () => removeDuplicateCities(cities).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [cities],
  );

  const popularCityNames = useMemo(() => new Set(POPULAR_CITY_NAMES.map(normalizeName)), []);

  const popularCities = sortedCities.filter((city) =>
    popularCityNames.has(normalizeName(city.name)),
  );
  const regularCities = sortedCities.filter(
    (city) => !popularCityNames.has(normalizeName(city.name)),
  );
  const hasResults = sortedCities.length > 0 || filteredCountries.length > 0;
  const isLoading = isCitiesLoading || isCountriesLoading;
  const hasLocationsError = citiesError !== null || countriesError !== null;

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
        <p className={styles.searchHint}>Введите минимум 3 символа для поиска</p>
      ) : null}

      {hasResults ? (
        <div
          aria-busy={isLoading}
          className={styles.container}
        >
          {sortedCities.length > 0 || citiesError ? (
            <section className={styles.citySection}>
              <h2 className={styles.title}>Города России</h2>

              {citiesError && <LocationLoadError />}

              {popularCities.length > 0 ? (
                <CityList
                  cities={popularCities}
                  highlighted
                  onSelect={completeCitySelection}
                />
              ) : null}

              {regularCities.length > 0 ? (
                <CityList
                  cities={regularCities}
                  onSelect={completeCitySelection}
                />
              ) : null}
            </section>
          ) : null}

          {filteredCountries.length > 0 || countriesError ? (
            <section className={styles.countrySection}>
              <h2 className={styles.title}>Другие страны</h2>
              {countriesError ? (
                <LocationLoadError />
              ) : (
                <CountryList
                  countries={filteredCountries}
                  onSelect={completeCountrySelection}
                />
              )}
            </section>
          ) : null}
        </div>
      ) : isLoading ? (
        <div
          aria-busy="true"
          aria-label="Загрузка локаций"
          role="status"
        />
      ) : hasLocationsError ? (
        <LocationLoadError />
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
