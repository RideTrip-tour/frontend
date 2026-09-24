import styles from "./SearchInput.module.css";
import { SearchIcon } from "@/assets/icons/constructor";

interface SearchInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function SearchInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Поиск...",
  ariaLabel = "Поиск",
}: SearchInputProps) {
  return (
    <div className={styles.searchWrapper}>
      <label
        htmlFor={id}
        className={styles.visuallyHidden}
      >
        {ariaLabel}
      </label>
      
      <input
        id={id}
        name={name}
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.searchIcon}>
        <SearchIcon aria-hidden="true" />
      </div>
    </div>
  );
}
