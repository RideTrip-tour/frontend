import type { Country } from '@/entities/country/model/types';
import { locationsApi, locationsRequestOptions } from '@/shared/api/locations/locationsApi';

/**
 * Количество стран, загружаемых за один запрос.
 */
const COUNTRY_PAGE_SIZE = 9;

/**
 * Максимальное количество стран,
 * отображаемых в селекторе.
 */
const MAX_VISIBLE_COUNTRIES = 9;

const EXCLUDED_COUNTRY_NAMES = new Set(['россия']);

interface GetCountriesOptions {
  name?: string;
  signal?: AbortSignal;
}

/**
 * Загружает страны через API локаций.
 *
 * При передаче `name` выполняется поиск стран по названию.
 * Россия исключается из списка отображаемых стран.
 *
 * @param options Параметры запроса стран.
 * @param options.name Название или поисковый запрос.
 * @param options.signal Сигнал для отмены HTTP-запроса.
 * @returns Массив стран для отображения.
 * @throws Ошибка API или сети при неудачном запросе.
 */
export async function getCountries(options: GetCountriesOptions = {}): Promise<Country[]> {
  const countries: Country[] = [];
  let offset = 0;

  while (true) {
    const requestOptions = {
      ...locationsRequestOptions,
      signal: options.signal,
    };

    const { data } = await locationsApi.readCountriesApiLocationsReferencesCountriesGet(
      {
        limit: COUNTRY_PAGE_SIZE,
        offset,
        name: options.name?.trim() || undefined,
      },
      requestOptions,
    );

    countries.push(...data.items);
    offset += data.items.length;

    if (data.items.length === 0 || offset >= data.total || data.items.length < COUNTRY_PAGE_SIZE) {
      break;
    }
  }

  return countries
    .filter((country) => {
      const normalizedName = country.name.trim().toLocaleLowerCase('ru-RU');

      return !EXCLUDED_COUNTRY_NAMES.has(normalizedName);
    })
    .slice(0, MAX_VISIBLE_COUNTRIES);
}
