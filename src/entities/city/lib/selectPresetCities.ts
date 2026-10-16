import type { City } from '@/entities/city/model/types';
import { PRESET_CITY_NAMES } from '@/widgets/travel-constructor/config/citySelector';

function normalizeCityName(name: string): string {
  return name.trim().toLocaleLowerCase('ru-RU');
}

export function selectPresetCities(cities: City[]): City[] {
  const citiesByName = new Map(
    cities.map((city) => [normalizeCityName(city.name), city]),
  );

  return PRESET_CITY_NAMES.map((name) =>
    citiesByName.get(normalizeCityName(name)),
  ).filter((city): city is City => city !== undefined);
}