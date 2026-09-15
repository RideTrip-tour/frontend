import clsx from 'clsx';
import styles from './AccommodationSelector.module.scss';

interface FilterGroupProps {
  title: string;
  options: readonly string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

export function FilterGroup({
  title,
  options,
  selectedOptions,
  onToggle,
}: FilterGroupProps) {
  return (
    <section className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>{title}</h3>
      <div className={styles.chips}>
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);

          return (
            <button
              aria-pressed={isSelected}
              className={clsx(styles.chip, {
                [styles.chipSelected]: isSelected,
              })}
              key={option}
              onClick={() => onToggle(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
