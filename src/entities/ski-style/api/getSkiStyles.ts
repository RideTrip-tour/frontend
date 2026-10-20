import type { SkiStyle } from '@/entities/ski-style/model/types';
import { locationsApi, locationsRequestOptions } from '@/shared/api/locations/locationsApi';

const STYLE_PAGE_SIZE = 100;
const PLACEHOLDER_STYLE_NAMES = new Set(['string']);

/**
 * Загружает стили катания из справочника API локаций.
 *
 * @param signal Сигнал для отмены HTTP-запроса.
 * @returns Список стилей катания для селектора активностей.
 * @throws Ошибка API или сети при неудачном запросе.
 */
export async function getSkiStyles(signal?: AbortSignal): Promise<SkiStyle[]> {
  const { data } = await locationsApi.readStylesApiLocationsReferencesStylesGet(
    {
      limit: STYLE_PAGE_SIZE,
      offset: 0,
    },
    {
      ...locationsRequestOptions,
      signal,
    },
  );

  return data.items.filter(
    (style) => !PLACEHOLDER_STYLE_NAMES.has(style.name.trim().toLocaleLowerCase('ru-RU')),
  );
}
