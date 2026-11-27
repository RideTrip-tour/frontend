import type { SkiLevelReference } from '@/entities/ski-level/model/types';
import { locationsApi, locationsRequestOptions } from '@/shared/api/locations/locationsApi';

const LEVEL_PAGE_SIZE = 100;
const PLACEHOLDER_LEVEL_NAMES = new Set(['string']);

export async function getSkiLevels(signal?: AbortSignal): Promise<SkiLevelReference[]> {
  const { data } = await locationsApi.readLevelsApiLocationsReferencesLevelsGet(
    { limit: LEVEL_PAGE_SIZE, offset: 0 },
    { ...locationsRequestOptions, signal },
  );

  return data.items.filter(
    (level) => !PLACEHOLDER_LEVEL_NAMES.has(level.name.trim().toLocaleLowerCase('ru-RU')),
  );
}
