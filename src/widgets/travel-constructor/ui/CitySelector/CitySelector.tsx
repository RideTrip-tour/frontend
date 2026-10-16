import clsx from 'clsx';

import type { City } from '@/entities/city/model/types';
import { POPULAR_CITY_NAMES } from '@/widgets/travel-constructor/config/citySelector';

import styles from './CitySelector.module.scss';

interface CitySelectorProps {
  cities: City[];
  onSelect: (city: City) => void;
}

interface CityColumnsProps {
  readonly columns: City[][];
  readonly onSelect: (city: City) => void;
}

const COLUMN_KEYS = ['left', 'center', 'right'] as const;

function normalizeCityName(name: string): string {
  return name.trim().toLocaleLowerCase('ru-RU');
}

function CityColumns({ columns, onSelect }: CityColumnsProps) {
  return columns.map((columnCities, columnIndex) => (
    <div
      key={COLUMN_KEYS[columnIndex]}
      className={styles.column}
    >
      <ul className={styles.list}>
        {columnCities.map((city) => (
          <li
            key={city.id}
            className={styles.listItem}
          >
            <button
              type="button"
              className={styles.cityButton}
              onClick={() => onSelect(city)}
            >
              {city.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  ));
}

function createColumns(cities: City[]): City[][] {
  const columns: City[][] = [[], [], []];

  cities.forEach((city, index) => {
    columns[index % 3].push(city);
  });

  return columns;
}

export function CitySelector({
  cities,
  onSelect,
}: Readonly<CitySelectorProps>) {
  const popularCityNames = new Set(
    POPULAR_CITY_NAMES.map(normalizeCityName),
  );

  const sortedCities = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name, 'ru'),
  );

  const popularCities = sortedCities.filter((city) =>
    popularCityNames.has(normalizeCityName(city.name)),
  );

  const regularCities = sortedCities.filter(
    (city) => !popularCityNames.has(normalizeCityName(city.name)),
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>Города России</div>

      {popularCities.length > 0 ? (
        <div className={clsx(styles.columnsWrapper, styles.frequentColumns)}>
          <CityColumns
            columns={createColumns(popularCities)}
            onSelect={onSelect}
          />
        </div>
      ) : null}

      {regularCities.length > 0 ? (
        <div className={styles.columnsWrapper}>
          <CityColumns
            columns={createColumns(regularCities)}
            onSelect={onSelect}
          />
        </div>
      ) : null}
    </div>
  );
}