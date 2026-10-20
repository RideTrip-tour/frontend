import clsx from 'clsx';

import type { City } from '../../model/types';

import styles from './CityList.module.scss';

interface CityListProps {
  cities: City[];
  onSelect: (city: City) => void;
  highlighted?: boolean;
}

const COLUMN_KEYS = ['left', 'center', 'right'] as const;

const COLUMN_COUNT = 3;

function createColumns(cities: City[]): City[][] {
  const columnSize = Math.ceil(cities.length / COLUMN_COUNT);

  return Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => {
    const startIndex = columnIndex * columnSize;
    const endIndex = startIndex + columnSize;

    return cities.slice(startIndex, endIndex);
  });
}

export function CityList({ cities, onSelect, highlighted = false }: Readonly<CityListProps>) {
  const columns = createColumns(cities);

  return (
    <div className={styles.columnsWrapper}>
      {columns.map((columnCities, columnIndex) => (
        <div
          key={COLUMN_KEYS[columnIndex]}
          className={styles.column}
        >
          <ul className={styles.list}>
            {columnCities.map((city) => (
              <li
                key={city.id}
                className={clsx(styles.listItem, {
                  [styles.highlighted]: highlighted,
                })}
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
      ))}
    </div>
  );
}
