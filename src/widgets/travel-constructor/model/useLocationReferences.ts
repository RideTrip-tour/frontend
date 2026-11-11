import { useCallback, useEffect, useRef, useState } from 'react';

import { getCities, getPresetCities } from '@/entities/city/api/getCities';
import type { City } from '@/entities/city/model/types';
import { getCountries } from '@/entities/country/api/getCountries';
import type { Country } from '@/entities/country/model/types';
import { getSkiLevels } from '@/entities/ski-level';
import type { SkiLevelReference } from '@/entities/ski-level';
import { getSkiStyles } from '@/entities/ski-style';
import type { SkiStyle } from '@/entities/ski-style';

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
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState<Error | null>(null);
  const [countriesError, setCountriesError] = useState<Error | null>(null);
  const [skiStyles, setSkiStyles] = useState<SkiStyle[]>([]);
  const [skiLevels, setSkiLevels] = useState<SkiLevelReference[]>([]);
  const [isSkiStylesLoading, setIsSkiStylesLoading] = useState(true);
  const [isSkiLevelsLoading, setIsSkiLevelsLoading] = useState(true);

  const citySearchControllerRef = useRef<AbortController | null>(null);
  const countriesControllerRef = useRef<AbortController | null>(null);
  const cityQueryRef = useRef('');

  const searchCities = useCallback(async (query: string): Promise<void> => {
    citySearchControllerRef.current?.abort();

    const controller = new AbortController();
    citySearchControllerRef.current = controller;
    cityQueryRef.current = query;
    setIsCitiesLoading(true);
    setCitiesError(null);

    try {
      const loadedCities = query.trim()
        ? await getCities({
            name: query,
            signal: controller.signal,
          })
        : await getPresetCities();

      if (!controller.signal.aborted) {
        setCities(loadedCities);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setCities([]);
        setCitiesError(error instanceof Error ? error : new Error('Не удалось загрузить города'));
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsCitiesLoading(false);
      }
    }
  }, []);

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
    await Promise.all([searchCities(cityQueryRef.current), loadCountries()]);
  }, [loadCountries, searchCities]);

  useEffect(() => {
    void reloadLocations();

    return () => {
      citySearchControllerRef.current?.abort();
      countriesControllerRef.current?.abort();
    };
  }, [reloadLocations]);

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
