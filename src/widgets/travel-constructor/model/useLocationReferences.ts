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
  skiStyles: SkiStyle[];
  skiLevels: SkiLevelReference[];
  isSkiStylesLoading: boolean;
  isSkiLevelsLoading: boolean;
  searchCities: (query: string) => Promise<void>;
}

export function useLocationReferences(): LocationReferencesState {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [skiStyles, setSkiStyles] = useState<SkiStyle[]>([]);
  const [skiLevels, setSkiLevels] = useState<SkiLevelReference[]>([]);
  const [isSkiStylesLoading, setIsSkiStylesLoading] = useState(true);
  const [isSkiLevelsLoading, setIsSkiLevelsLoading] = useState(true);

  const citySearchControllerRef = useRef<AbortController | null>(null);

  const searchCities = useCallback(async (query: string): Promise<void> => {
    citySearchControllerRef.current?.abort();

    const controller = new AbortController();
    citySearchControllerRef.current = controller;

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
    } catch {
      if (!controller.signal.aborted) {
        setCities([]);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadReferences = async () => {
      try {
        const [citiesResult, countriesResult, skiStylesResult, skiLevelsResult] =
          await Promise.allSettled([
            getPresetCities(),
            getCountries({ signal: controller.signal }),
            getSkiStyles(controller.signal),
            getSkiLevels(controller.signal),
          ]);

        if (!controller.signal.aborted) {
          setCities(citiesResult.status === 'fulfilled' ? citiesResult.value : []);
          setCountries(countriesResult.status === 'fulfilled' ? countriesResult.value : []);
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
      citySearchControllerRef.current?.abort();
    };
  }, []);

  return {
    cities,
    countries,
    isSkiStylesLoading,
    isSkiLevelsLoading,
    searchCities,
    skiStyles,
    skiLevels,
  };
}
