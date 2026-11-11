import { useCallback, useEffect, useMemo, useState } from 'react';

import { PartnerOffersRequestError, requestMockPartnerOffers } from '../mocks/searchPartnerOffers';
import { usePartnerOfferSearchFilters } from './searchFiltersStore';
import type {
  PartnerOfferSearchFilters,
  PartnerOffersScenario,
  PartnerOffersSearchState,
  RelaxableFilterKey,
} from './types';

interface UsePartnerOffersOptions {
  scenario: PartnerOffersScenario;
  requestedFilters: PartnerOfferSearchFilters;
}

interface CompletedRequest {
  key: string;
  result: PartnerOffersSearchState;
}

export function usePartnerOffers({ scenario, requestedFilters }: UsePartnerOffersOptions) {
  const restoration = usePartnerOfferSearchFilters((state) => state.restoration);
  const syncScenario = usePartnerOfferSearchFilters((state) => state.syncScenario);
  const restoreStoredFilter = usePartnerOfferSearchFilters((state) => state.restoreFilter);
  const restoreStoredFilters = usePartnerOfferSearchFilters((state) => state.restoreAllFilters);
  const [completedRequest, setCompletedRequest] = useState<CompletedRequest | null>(null);

  // Новый набор моковых данных начинает отдельный поиск; редактирование его фильтров
  // сохраняет уже восстановленные пользователем ограничения.
  useEffect(() => syncScenario(scenario), [scenario, syncScenario]);

  const restoredKeys = restoration.scenario === scenario ? restoration.keys : [];
  const restoredKeysString = restoredKeys.join(',');
  const filtersString = JSON.stringify(requestedFilters);
  const filtersSnapshot = useMemo(
    () => JSON.parse(filtersString) as PartnerOfferSearchFilters,
    [filtersString],
  );
  const requestKey = `${scenario}:${filtersString}:${restoredKeysString}`;

  useEffect(() => {
    const controller = new AbortController();
    const keys = restoredKeysString ? (restoredKeysString.split(',') as RelaxableFilterKey[]) : [];

    void requestMockPartnerOffers({
      scenario,
      requestedFilters: filtersSnapshot,
      restoredFilters: keys,
      signal: controller.signal,
    }).then(
      (result) => {
        if (!controller.signal.aborted) {
          setCompletedRequest({ key: requestKey, result });
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setCompletedRequest({
            key: requestKey,
            result: {
              status: 'error',
              mode: 'exact',
              offers: [],
              totalCount: 0,
              relaxations: [],
              effectiveFilters: { ...filtersSnapshot },
              errorSource: error instanceof PartnerOffersRequestError ? error.source : 'offers',
            },
          });
        }
      },
    );

    return () => controller.abort();
  }, [filtersSnapshot, requestKey, restoredKeysString, scenario]);

  const restoreFilter = useCallback(
    (key: RelaxableFilterKey) => {
      restoreStoredFilter(scenario, key);
    },
    [restoreStoredFilter, scenario],
  );

  const restoreAllFilters = useCallback(() => {
    restoreStoredFilters(scenario);
  }, [restoreStoredFilters, scenario]);

  const state: PartnerOffersSearchState =
    completedRequest?.key === requestKey
      ? completedRequest.result
      : {
          status: 'loading',
          mode: 'exact',
          offers: [],
          totalCount: 0,
          relaxations: [],
          effectiveFilters: { ...filtersSnapshot },
          errorSource: null,
        };

  return { ...state, restoreFilter, restoreAllFilters };
}
