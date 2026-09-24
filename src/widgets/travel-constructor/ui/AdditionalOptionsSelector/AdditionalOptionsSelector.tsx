import type { AdditionalOption } from '@/widgets/travel-constructor/model/types';
import { OPTION_GROUPS } from '@/widgets/travel-constructor/config/additionalOptions';
import styles from './AdditionalOptionsSelector.module.scss';

interface AdditionalOptionsSelectorProps {
  selectedOptions: AdditionalOption[];
  onChange: (options: AdditionalOption[]) => void;
}

export function AdditionalOptionsSelector({
  selectedOptions,
  onChange,
}: AdditionalOptionsSelectorProps) {
  const toggleOption = (option: AdditionalOption) => {
    const isSelected = selectedOptions.includes(option);

    onChange(
      isSelected
        ? selectedOptions.filter((selectedOption) => selectedOption !== option)
        : [...selectedOptions, option],
    );
  };

  return (
    <div className={styles.selector}>
      <h3 className={styles.title}>Дополнительные возможности поездки</h3>

      <div className={styles.groups}>
        {OPTION_GROUPS.map((group) => (
          <section className={styles.group} key={group.title}>
            <h4>{group.title}</h4>
            <div className={styles.options}>
              {group.options.map((option) => {
                const isSelected = selectedOptions.includes(option);

                return (
                  <button
                    aria-pressed={isSelected}
                    className={styles.option}
                    key={option}
                    onClick={() => toggleOption(option)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
