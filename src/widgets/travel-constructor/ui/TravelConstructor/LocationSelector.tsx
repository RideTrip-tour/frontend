import { useMemo, useState } from 'react';
import { EmptyState } from '@/shared/ui/base/EmptyState';
import { SearchInput } from '@/shared/ui/base/SearchInput';
import { AlertIcon } from '@/assets/icons/constructor';
import type { City } from '@/entities/city';
import type { Country } from '@/entities/country';
import { CitySelector } from '../CitySelector';
import { CountrySelector } from '../CountrySelector';

interface LocationSelectorProps {
  idPrefix: string;
  cities: City[];
  countries: Country[];
  onCitySelect: (city: City) => void;
  onCountrySelect: (country: Country) => void;
  onComplete: () => void;
}

export function LocationSelector({
  idPrefix,
  cities,
  countries,
  onCitySelect,
  onCountrySelect,
  onComplete,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ru-RU');
  const filteredCities = useMemo(() => {
    if (!normalizedQuery) {
      return cities;
    }

    return cities.filter((city) => (
      city.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
    ));
  }, [cities, normalizedQuery]);

  const filteredCountries = useMemo(() => {
    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter((country) => (
      country.name.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
    ));
  }, [countries, normalizedQuery]);

  const hasResults = filteredCities.length > 0 || filteredCountries.length > 0;

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

      {hasResults ? (
        <>
          <CitySelector
            cities={filteredCities}
            onSelect={completeCitySelection}
          />
          <CountrySelector
            countries={filteredCountries}
            onSelect={completeCountrySelection}
          />
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
