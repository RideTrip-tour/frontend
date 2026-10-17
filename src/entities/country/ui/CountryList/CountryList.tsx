import type { Country } from '../../model/types';

import styles from './CountryList.module.scss';

interface CountryListProps {
  countries: Country[];
  onSelect: (country: Country) => void;
}

const COLUMN_KEYS = ['left', 'center', 'right'] as const;

function createColumns(countries: Country[]): Country[][] {
  const columns: Country[][] = [[], [], []];

  countries.forEach((country, index) => {
    columns[index % columns.length].push(country);
  });

  return columns;
}

export function CountryList({ countries, onSelect }: Readonly<CountryListProps>) {
  const columns = createColumns(countries);

  return (
    <div className={styles.columnsWrapper}>
      {columns.map((columnCountries, columnIndex) => (
        <div
          key={COLUMN_KEYS[columnIndex]}
          className={styles.column}
        >
          <ul className={styles.list}>
            {columnCountries.map((country) => (
              <li
                key={country.id}
                className={styles.listItem}
              >
                <button
                  type="button"
                  className={styles.countryButton}
                  onClick={() => onSelect(country)}
                >
                  {country.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
