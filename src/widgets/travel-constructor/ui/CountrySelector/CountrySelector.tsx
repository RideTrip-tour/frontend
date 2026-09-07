import type { Country } from "@/entities/country/model/types";
import styles from "./CountrySelector.module.scss";

interface CountrySelectorProps {
  countries: Country[];
  onSelect: (country: Country) => void;
}

export function CountrySelector({
  countries,
  onSelect,
}: CountrySelectorProps) {
  // Сортируем страны по алфавиту
  const sortedCountries = [...countries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Разбиваем страны по 3 колонкам
  const columns: Country[][] = [[], [], []];

  sortedCountries.forEach((country, index) => {
    const columnIndex = index % 3;
    columns[columnIndex].push(country);
  });

  // Если нет результатов поиска
  if (sortedCountries.length === 0) {
    return null; // Просто ничего не рендерим
  }

  return (
    <div className={styles.container}>
      {/* Заголовок */}
      <div className={styles.title}>Другие страны</div>

      {/* Страны в 3 колонки */}
      <div className={styles.columnsWrapper}>
        {columns.map((columnCountries, colIndex) => (
          <div key={colIndex} className={styles.column}>
            <ul className={styles.list}>
              {columnCountries.map((country) => (
                <li
                  key={country.id}
                  className={styles.listItem}
                  onClick={() => onSelect(country)}
                >
                  {country.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
