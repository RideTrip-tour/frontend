import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getCities,
  getPresetCities,
} from '@/entities/city/api/getCities';
import type { City } from '@/entities/city/model/types';
import { getCountries } from '@/entities/country/api/getCountries';
import type { Country } from '@/entities/country/model/types';

interface LocationReferencesState {
  cities: City[];
  countries: Country[];
  searchCities: (query: string) => Promise<void>;
}

export function useLocationReferences(): LocationReferencesState {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);

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
        const [loadedCities, loadedCountries] = await Promise.all([
          getPresetCities(),
          getCountries({ signal: controller.signal }),
        ]);

        if (!controller.signal.aborted) {
          setCities(loadedCities);
          setCountries(loadedCountries);
        }
      } catch {
        if (!controller.signal.aborted) {
          setCities([]);
          setCountries([]);
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
    searchCities,
  };
}