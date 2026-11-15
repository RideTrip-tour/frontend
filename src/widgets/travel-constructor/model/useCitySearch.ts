import { useCallback, useEffect, useRef, useState } from 'react';

import { getCities, getPresetCities } from '@/entities/city/api/getCities';
import type { City } from '@/entities/city/model/types';

export function useCitySearch() {
  const [cities, setCities] = useState<City[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState<Error | null>(null);
  const citySearchControllerRef = useRef<AbortController | null>(null);
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

  const reloadCities = useCallback(() => searchCities(cityQueryRef.current), [searchCities]);

  useEffect(() => {
    void searchCities('');

    return () => citySearchControllerRef.current?.abort();
  }, [searchCities]);

  return { cities, isCitiesLoading, citiesError, searchCities, reloadCities };
}
