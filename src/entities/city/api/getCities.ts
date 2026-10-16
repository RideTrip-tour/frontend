import { selectPresetCities } from '@/entities/city/lib/selectPresetCities';
import type { City } from '@/entities/city/model/types';
import {
  locationsApi,
  locationsRequestOptions,
} from '@/shared/api/locations/locationsApi';

/**
 * Максимальное количество городов,
 * возвращаемых одним поисковым запросом.
 */
const SEARCH_CITY_LIMIT = 21;

/**
 * Максимальное количество записей,
 * загружаемых API за одну страницу.
 */
const API_PAGE_SIZE = 100;

/**
 * Параметры запроса городов.
 */
interface GetCitiesOptions {
  /**
   * Сигнал для отмены HTTP-запроса.
   */
  signal?: AbortSignal;

  /**
   * Поисковый запрос по названию города.
   */
  name?: string;
}

let presetCitiesCache: City[] | null = null;
let presetCitiesRequest: Promise<City[]> | null = null;

function createRequestOptions(signal?: AbortSignal) {
  return {
    ...locationsRequestOptions,
    signal,
  };
}

/**
 * Загружает города по поисковому запросу.
 *
 * Если передан параметр `name`, API выполняет поиск
 * по названию города. Без поискового запроса возвращаются
 * первые города из списка API.
 *
 * @param options Параметры запроса городов.
 * @returns Массив найденных городов.
 * @throws Ошибка API или сети при неудачном запросе.
 */
export async function getCities(
  options: GetCitiesOptions = {},
): Promise<City[]> {
  const { data } =
    await locationsApi.readCitiesApiLocationsReferencesCitiesGet(
      {
        limit: SEARCH_CITY_LIMIT,
        offset: 0,
        name: options.name?.trim() || undefined,
      },
      createRequestOptions(options.signal),
    );

  return data.items;
}

/**
 * Загружает все страницы городов из API,
 * а затем выбирает только города из предустановленного списка.
 *
 * Метод используется для первоначального отображения
 * городов в селекторе.
 *
 * @returns Массив предустановленных городов.
 * @throws Ошибка API или сети при неудачном запросе.
 */
async function loadPresetCities(): Promise<City[]> {
  const allCities: City[] = [];
  let offset = 0;

  while (true) {
    const { data } =
      await locationsApi.readCitiesApiLocationsReferencesCitiesGet(
        {
          limit: API_PAGE_SIZE,
          offset,
        },
        createRequestOptions(),
      );

    allCities.push(...data.items);
    offset += data.items.length;

    if (
      data.items.length === 0 ||
      offset >= data.total ||
      data.items.length < API_PAGE_SIZE
    ) {
      break;
    }
  }

  return selectPresetCities(allCities);
}

/**
 * Возвращает предустановленные города.
 *
 * При первом вызове загружает города из API и сохраняет
 * результат в памяти. Последующие вызовы используют кеш
 * и не отправляют новые запросы.
 *
 * Если несколько компонентов одновременно вызовут метод
 * во время первой загрузки, они будут использовать один
 * общий HTTP-запрос.
 *
 * @returns Массив предустановленных городов.
 * @throws Ошибка API или сети при неудачной загрузке.
 */
export function getPresetCities(): Promise<City[]> {
  if (presetCitiesCache) {
    return Promise.resolve(presetCitiesCache);
  }

  presetCitiesRequest ??= loadPresetCities()
    .then((cities) => {
      presetCitiesCache = cities;

      return cities;
    })
    .finally(() => {
      presetCitiesRequest = null;
    });

  return presetCitiesRequest;
}
