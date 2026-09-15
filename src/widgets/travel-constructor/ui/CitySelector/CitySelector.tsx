import type { City } from "@/entities/city/model/types";
import styles from "./CitySelector.module.scss";
import clsx from "clsx";
import { FREQUENT_CITY_NAMES } from '@/widgets/travel-constructor/config/citySelector';

interface CitySelectorProps {
  cities: City[];
  onSelect: (city: City) => void;
}

interface CityColumnsProps {
  readonly columns: City[][];
  readonly onSelect: (city: City) => void;
}

const COLUMN_KEYS = ['left', 'center', 'right'] as const;

function CityColumns({ columns, onSelect }: CityColumnsProps) {
  return columns.map((columnCities, colIndex) => (
    <div key={COLUMN_KEYS[colIndex]} className={styles.column}>
      <ul className={styles.list}>
        {columnCities.map(city => (
          <li key={city.id} className={styles.listItem}>
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

export function CitySelector({
  cities,
  onSelect,
}: CitySelectorProps) {
  // Сортируем города по алфавиту
  const sortedCities = [...cities].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Часто нажимаемые - только Москва и Санкт-Петербург
  const frequentCities = sortedCities.filter(city =>
    FREQUENT_CITY_NAMES.some((name) => name === city.name)
  );

  // Остальные города (без Москвы и Санкт-Петербурга)
  const restCities = sortedCities.filter(city =>
    !FREQUENT_CITY_NAMES.some((name) => name === city.name)
  );

  // Разбиваем остальные города по 3 колонкам
  const columns: City[][] = [[], [], []];

  restCities.forEach((city, index) => {
    const columnIndex = index % 3;
    columns[columnIndex].push(city);
  });

  // Разбиваем частые города по колонкам (Москва - 1-я, Питер - 2-я)
  const frequentColumns: City[][] = [[], [], []];
  frequentCities.forEach((city, index) => {
    frequentColumns[index].push(city);
  });

  return (
    <div className={styles.container}>
      {/* Секция 1: Заголовок */}
      <div className={styles.title}>Города России</div>

      {/* Секция 2: Часто нажимаемые в 3 колонки */}
      {frequentCities.length > 0 && (
        <div className={clsx(styles.columnsWrapper, styles.frequentColumns)}>
          <CityColumns columns={frequentColumns} onSelect={onSelect} />
        </div>
      )}

      {/* Секция 3: Остальные города в 3 колонки */}
      {restCities.length > 0 && (
        <div className={styles.columnsWrapper}>
          <CityColumns columns={columns} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}
