import { useCallback, useEffect, useRef, useState } from 'react';

import type { City } from '@/entities/city/model/types';
import { getCountries } from '@/entities/country/api/getCountries';
import type { Country } from '@/entities/country/model/types';
import { getSkiLevels } from '@/entities/ski-level';
import type { SkiLevelReference } from '@/entities/ski-level';
import { getSkiStyles } from '@/entities/ski-style';
import type { SkiStyle } from '@/entities/ski-style';

import { useCitySearch } from './useCitySearch';

interface LocationReferencesState {
  cities: City[];
  countries: Country[];
  isCitiesLoading: boolean;
  isCountriesLoading: boolean;
  citiesError: Error | null;
  countriesError: Error | null;
  skiStyles: SkiStyle[];
  skiLevels: SkiLevelReference[];
  isSkiStylesLoading: boolean;
  isSkiLevelsLoading: boolean;
  searchCities: (query: string) => Promise<void>;
  reloadLocations: () => Promise<void>;
}

export function useLocationReferences(): LocationReferencesState {
  const { cities, isCitiesLoading, citiesError, searchCities, reloadCities } = useCitySearch();
  const [countries, setCountries] = useState<Country[]>([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<Error | null>(null);
  const [skiStyles, setSkiStyles] = useState<SkiStyle[]>([]);
  const [skiLevels, setSkiLevels] = useState<SkiLevelReference[]>([]);
  const [isSkiStylesLoading, setIsSkiStylesLoading] = useState(true);
  const [isSkiLevelsLoading, setIsSkiLevelsLoading] = useState(true);

  const countriesControllerRef = useRef<AbortController | null>(null);

  const loadCountries = useCallback(async (): Promise<void> => {
    countriesControllerRef.current?.abort();

    const controller = new AbortController();
    countriesControllerRef.current = controller;
    setIsCountriesLoading(true);
    setCountriesError(null);

    try {
      const loadedCountries = await getCountries({ signal: controller.signal });

      if (!controller.signal.aborted) {
        setCountries(loadedCountries);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setCountries([]);
        setCountriesError(
          error instanceof Error ? error : new Error('Не удалось загрузить страны'),
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsCountriesLoading(false);
      }
    }
  }, []);

  const reloadLocations = useCallback(async (): Promise<void> => {
    await Promise.all([reloadCities(), loadCountries()]);
  }, [loadCountries, reloadCities]);

  useEffect(() => {
    void loadCountries();

    return () => {
      countriesControllerRef.current?.abort();
    };
  }, [loadCountries]);

  useEffect(() => {
    const controller = new AbortController();

    const loadReferences = async () => {
      try {
        const [skiStylesResult, skiLevelsResult] = await Promise.allSettled([
          getSkiStyles(controller.signal),
          getSkiLevels(controller.signal),
        ]);

        if (!controller.signal.aborted) {
          setSkiStyles(skiStylesResult.status === 'fulfilled' ? skiStylesResult.value : []);
          setSkiLevels(skiLevelsResult.status === 'fulfilled' ? skiLevelsResult.value : []);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSkiStylesLoading(false);
          setIsSkiLevelsLoading(false);
        }
      }
    };

    void loadReferences();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    cities,
    countries,
    isCitiesLoading,
    isCountriesLoading,
    citiesError,
    countriesError,
    isSkiStylesLoading,
    isSkiLevelsLoading,
    searchCities,
    reloadLocations,
    skiStyles,
    skiLevels,
  };
}
